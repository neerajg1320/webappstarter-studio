import './preview-console.css';
import {useEffect, useMemo, useRef, useState} from "react";
import {debugComponent} from "../../config/global";
import Args from "../common/expandable-args/args";

export interface ConsoleMessage {
  source: string,
  type: string,
  content: string|TypeError,
}

interface PreviewConsoleProps {
  onChange?: (value:string) => void
}

const PreviewConsole:React.FC<PreviewConsoleProps> = ({onChange:propOnChange}) => {
  const [messages, setMessages] = useState<ConsoleMessage[]>([]);
  const consoleRef = useRef<HTMLDivElement|null>(null);
  const infoObj = useMemo(() => {
    return {
      name:"Neeraj",
      height:171,
      school: {name: "SSN", batch:1994},
      age: 46,
      hobbies: ["badminton", "harmonica", "sudoku"]
    };
  }, []);

  useEffect(() => {

    const handleMessage:(ev: MessageEvent<any>) => any = (event) => {
      if (debugComponent) {
        console.log('iframe:', event.data);
      }

      const {source} = event.data as ConsoleMessage;
      if (source && source === "iframe") {
        setMessages((prev) => {
          return [...prev, event.data]
        });
      }
    };

    window.addEventListener('message', handleMessage, false);

    if (debugComponent) {
      console.log(`PreviewConsole:useEffect[] 'message' event listener added.`)
    }

    return () => {
      window.removeEventListener('message', handleMessage)
      if (debugComponent) {
        console.log(`PreviewConsole:useEffect[]:destroy 'message' event listener removed.`)
      }
    }
  }, []);

  const consoleGoBottom = () => {
    if (consoleRef.current) {
      if (debugComponent) {
        console.log(`PreviewConsole:useEffect[text] adjust scroll to bottom`)
      }
      const divElement = (consoleRef.current as HTMLDivElement);
      divElement.scrollTop = divElement.scrollHeight;
    }
  };

  useEffect(() => {
    if (debugComponent) {
      console.log(`PreviewConsole:useEffect[messages]  messages[${messages?.length}]:`, messages)
    }

    if (propOnChange) {
      if (messages .length > 0) {
        // propOnChange(messages);
      }
    }

    consoleGoBottom();
  }, [messages]);

  const handleConsoleClear = () => {
    setMessages([]);
  }

  const handleConsoleBottom = () => {
    consoleGoBottom();
  }

  return (
    <div className="console-wrapper" ref={consoleRef}>
      <ul>
        {(messages.length > 0) &&
          messages.map((message, index) => {
            if (message.type === "log") {
              let retComp;
              if (['string', 'number'].includes(typeof message.content)) {
                retComp = <li key={index} className={`console-${message.type}`}>{message.content as string}</li>
              } else {
                retComp = <li key={index} className={`console-${message.type}`}>{JSON.stringify(message.content)}</li>
              }

              return (
                  <>
                    <Args list={["first", 34, infoObj, "new", ["one", "two"], infoObj]} />
                    {retComp}
                  </>
              )
            }
            return <li key={index} className={`console-${message.type}`}>{(message.content as TypeError).message}</li>
          })
        }
      </ul>

      <div className="console-control-bar">
        <button className="bottom-console button is-small is-family-secondary" onClick={handleConsoleBottom}>
          Bottom
        </button>
        <button className="clear-console button is-small is-family-secondary" onClick={handleConsoleClear}>
          Clear
        </button>
      </div>
    </div>
  );
}

export default PreviewConsole;
