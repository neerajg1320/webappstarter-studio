import './preview-console.css';
import {useEffect, useRef, useState} from "react";
import {debugComponent} from "../../config/global";

interface PreviewConsoleProps {
  onChange?: (value:string) => void
}

const PreviewConsole:React.FC<PreviewConsoleProps> = ({onChange:propOnChange}) => {
  const [text, setText] = useState<string>();
  const consoleRef = useRef<HTMLPreElement|null>(null);

  useEffect(() => {
    const handleMessage:(ev: MessageEvent<any>) => any = (event) => {
      const {source, content} = event.data;
      if (source && source === "iframe") {
        // console.log('iframe:', log);
        setText((prev) => {
          return [prev||'', content].join("\n");
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
      console.log(`PreviewConsole:useEffect[text] adjust scroll to bottom`)
      const preElement = (consoleRef.current as HTMLPreElement);
      preElement.scrollTop = preElement.scrollHeight;
    }
  };

  useEffect(() => {
    if (debugComponent) {
      console.log(`PreviewConsole:useEffect[text] length=${text?.length}`)
    }

    if (propOnChange) {
      if (text !== undefined) {
        propOnChange(text);
      }
    }

    consoleGoBottom();
  }, [text]);

  const handleConsoleClear = () => {
    setText('');
  }

  const handleConsoleBottom = () => {
    consoleGoBottom();
  }

  return (
    <pre className="console-wrapper" ref={consoleRef}>
      {text}
      <div className="console-control-bar">
        <button className="bottom-console button is-small is-family-secondary" onClick={handleConsoleBottom}>
          Bottom
        </button>
        <button className="clear-console button is-small is-family-secondary" onClick={handleConsoleClear}>
          Clear
        </button>
      </div>
    </pre>
  );
}

export default PreviewConsole;
