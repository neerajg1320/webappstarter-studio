import './preview-console.css';
import {useEffect, useState} from "react";
import {debugComponent} from "../../config/global";

const PreviewConsole = () => {
  const [text, setText] = useState<string>();

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

  return (
    <pre className="console-wrapper">
      {text}
    </pre>
  );
}

export default PreviewConsole;
