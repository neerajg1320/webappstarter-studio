import React, {useEffect, useRef, useState} from "react";
import './preview-iframe.css';
import {injectScriptInHtml} from "../../../utils/markup";
import {parentCommunicationJavascriptCode} from "./script";
import {debugComponent} from "../../../config/global";
import {IframeMessage} from "../message";

interface PreviewIframeProps {
  title: string;
  html: string;
  code: string;
  err: string;
}

const PreviewIframe:React.FC<PreviewIframeProps> = ({title, html, code, err}) => {
  const iframeRef = useRef<any>();
  const [isIframeInitialized, setIframeInitialized] = useState<boolean>(false);

  if (debugComponent) {
    console.log(`PreviewIframe: ${title.padEnd(20)}  [${html.length}, ${code.length}]`);
  }

  useEffect(() => {
    const handleMessage:(ev: MessageEvent<any>) => any = (event) => {
      const {source, type} = event.data as IframeMessage;
      if ((source && source === "iframe") && (type && type === "init")) {
        console.log(`PreviewIframe[${title}]: got the init from iframe`, event.data);
        setIframeInitialized(true);
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

  useEffect(() => {
    if (debugComponent) {
      console.log(`PreviewIframe: html:`, html);
    }

    iframeRef.current.srcdoc = injectScriptInHtml(html, parentCommunicationJavascriptCode);
  }, [html])

  useEffect(() => {
    console.log(`PreviewIframe:useEffect[...] isIframeInitialized=${isIframeInitialized} code.length=${code && code.length}`);

    if (!isIframeInitialized) {
      return;
    }

    // TBD: To make it fool proof we should convert it to be dependent on message from iframe
    // Get the initialization message from iframe and then send.
    // iframe is yet to support an initialization message

    // Today: This shall be made conditional
    setTimeout(() => {
      if (iframeRef.current) {
        console.log(`useEffect[code]: code of ${code.length} bytes sent to iframe`);

        // This is where the parent window sends the code to the child window
        const codeMessage:IframeMessage = {
          source: 'main',
          type: 'code',
          content: code
        };
        iframeRef.current.contentWindow.postMessage(codeMessage, '*');
      }
    }, 200);

  }, [code, isIframeInitialized]);

  return (
    <div className="preview-iframe">
      <iframe 
        ref={iframeRef} 
        title="preview" 
        sandbox="allow-scripts allow-modals allow-same-origin" />
    </div>
  );
}

export default React.memo(PreviewIframe);