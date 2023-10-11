import React, {useEffect, useRef, useState} from "react";
import './preview-iframe.css';
import {injectScriptInHtml} from "../../../utils/markup";
import {parentCommunicationJavascriptCode} from "./script";
import {debugComponent, debugIframeMessages} from "../../../config/global";
import {debugWindowEvent, IframeMessage} from "../message";

interface PreviewIframeProps {
  id: string;
  title: string;
  html: string;
  code: string;
  err: string;
}

const PreviewIframe:React.FC<PreviewIframeProps> = ({id, title, html, code, err}) => {
  const iframeRef = useRef<any>();
  const [isIframeInitialized, setIframeInitialized] = useState<boolean>(false);

  if (debugComponent) {
    console.log(`PreviewIframe: ${title.padEnd(20)}  [${html.length}, ${code.length}]`);
  }

  useEffect(() => {
    // console.log(iframeRef.current.contentWindow);
    const handleMessage:(ev: MessageEvent<any>) => any = (event) => {
      // console.log(`handleMessage:`, event.source, event.source === iframeRef.current.contentWindow);
      // debugWindowEvent(event);

      if (!iframeRef.current) {
        console.log(`handleMessage: iframe.current is '${iframeRef.current}' for '${title}'`)
        return;
      }

      // We return from here if the response is not from the iframe that this component created
      if (event.source !== iframeRef.current.contentWindow) {
        return;
      }

      const {source, type} = event.data as IframeMessage;
      if ((source && source === "iframe") && (type && type === "init")) {
        console.log(`PreviewIframe[${title.padStart(20)}] got the init from iframe`, event.data);
        setIframeInitialized(true);
      }
    };

    window.addEventListener('message', handleMessage, false);
    if (debugComponent) {
      console.log(`PreviewIframe[${title.padStart(20)}] useEffect[] 'message' event listener added.`)
    }

    return () => {
      window.removeEventListener('message', handleMessage)
      if (debugComponent) {
        console.log(`PreviewIframe[[${title.padStart(20)}]] useEffect[]:destroy 'message' event listener removed.`)
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
    console.log(`PreviewIframe[${title.padStart(20)}] useEffect[...] isIframeInitialized=${isIframeInitialized} code.length=${code && code.length}`);

    if (!isIframeInitialized) {
      return;
    }

    if (iframeRef.current) {
      if (debugIframeMessages) {
        console.log(`useEffect[code]: code size of ${code.length} bytes sent to iframe`);
      }

      // This is where the parent window sends the code to the child window
      const codeMessage:IframeMessage = {
        source: 'main',
        type: 'code',
        content: {id, code}
      };
      iframeRef.current.contentWindow.postMessage(codeMessage, '*');
    }

    setTimeout(() => {
    }, 0);

  }, [code, isIframeInitialized]);

  return (
    <div className="preview-iframe">
      <iframe
        id={id}
        ref={iframeRef} 
        title={title}
        sandbox="allow-scripts allow-modals allow-same-origin" />
    </div>
  );
}

export default React.memo(PreviewIframe);