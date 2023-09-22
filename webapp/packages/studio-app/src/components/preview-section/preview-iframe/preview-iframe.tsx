import React, {useEffect, useRef, useState} from "react";
import './preview-iframe.css';
import {injectScriptInHtml} from "../../../utils/markup";
import {parentCommunicationJavascriptCode} from "./script";
import {debugComponent} from "../../../config/global";

interface PreviewIframeProps {
  title: string;
  html: string;
  code: string;
  err: string;
}

const PreviewIframe:React.FC<PreviewIframeProps> = ({title, html, code, err}) => {
  const iframeRef = useRef<any>();

  if (debugComponent || true) {
    console.log(`PreviewIframe: ${title.padEnd(20)}  [${html.length}, ${code.length}]`);
  }

  useEffect(() => {
    if (debugComponent) {
      console.log(`PreviewIframe: html:`, html);
    }

    iframeRef.current.srcdoc = injectScriptInHtml(html, parentCommunicationJavascriptCode);

    // TBD: To make it fool proof we should convert it to be dependent on message from iframe
    // Get the initialization message from iframe and then send.
    // iframe is yet to support an initialization message
    setTimeout(() => {
      iframeRef.current.contentWindow.postMessage(code, '*');
    }, 200);
  }, [code]);

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