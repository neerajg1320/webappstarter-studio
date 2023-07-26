import './preview-console.css';
import {useEffect, useRef, useState} from "react";
import {debugComponent} from "../../config/global";

interface PreviewConsoleProps {
  onChange?: (value:string) => void
}

const PreviewConsole:React.FC<PreviewConsoleProps> = ({onChange}) => {
  const [text, setText] = useState<string>();
  const consoleRef = useRef<HTMLPreElement|null>(null);

  useEffect(() => {
    const handleMessage:(ev: MessageEvent<any>) => any = (event) => {
      const {source, log} = event.data;
      if (source && source === "iframe") {
        // console.log('iframe:', log);
        setText((prev) => {
          return [prev||'', log].join("\n");
        });
      }
    };

    window.addEventListener('message', handleMessage, false);
    if (debugComponent || true) {
      console.log(`PreviewConsole:useEffect[] 'message' event listener added.`)
    }

    return () => {
      window.removeEventListener('message', handleMessage)
      if (debugComponent || true) {
        console.log(`PreviewConsole:useEffect[]:destroy 'message' event listener removed.`)
      }
    }
  }, []);

  useEffect(() => {
    if (onChange) {
      if (text !== undefined) {
        onChange(text);
      }
    }
    if (consoleRef.current) {
      const preElement = (consoleRef.current as HTMLPreElement);
      preElement.scrollTop = preElement.scrollHeight;
    }
  }, [text]);

  return (
    <pre className="console-wrapper" ref={consoleRef}>
      {text}
    </pre>
  );
}

export default PreviewConsole;
