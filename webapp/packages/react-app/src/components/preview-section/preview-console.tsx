import './preview-console.css';
import {useEffect} from "react";
import {debugComponent} from "../../config/global";

const PreviewConsole = () => {
  useEffect(() => {
    const handleMessage:(ev: MessageEvent<any>) => any = (event) => {
      const {source, log} = event.data;
      if (source && source === "iframe") {
        console.log('iframe:', log);
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
    <div className="console-wrapper">
      <h1>Console here</h1>
    </div>
  );
}

export default PreviewConsole;
