import './preview-iframe.css';
import {useEffect, useRef, useState} from "react";
import {injectScriptInHtml} from "../../utils/markup";

const simpleJavascriptCode = `
    console.log('hello from script');
    console.log('would you talk to me');
`;

const parentCommunicationJavascriptCode = `
    const window_console_log = window.console.log;
    
    window.console.log = function(...args) {
      // We save the console.log function before we override it
      window_console_log(...args);
      
      const message = {
        source: "iframe",
        type: 'log',
        content: args, // args is an array
      }
      window.parent.postMessage(message, '*');
    }
    
    // TBD: Need to verify the flow here
    const handleError = (err) => {
      const root = document.querySelector('#root');
      root.innerHTML = '<div style="color:red"><h4>Runtime Error:</h4>' + err + '</div>';
      // console.error(err);
      
      const message = {
        source: "iframe",
        type: 'error',
        content: err,
      }
      window.parent.postMessage(message, '*');        
    };

    window.addEventListener('error', (event) => {
      event.preventDefault();
      handleError(event.error);
    });

    window.addEventListener('message', (event) => {
      // console.log(event.data);
      try {
        eval(event.data);
      } catch (err) {
        handleError(err);
      }
    }, false);
    
    console.log('Parent Communicated Script Injected');
`;

const htmlWithScript = `
<html>
  <head>
    <title>HTML With Script</title>
    <style>html {background-color: white}</style>
  </head>
  <body>
    <div id="root"></div>
    <script>
        ${parentCommunicationJavascriptCode}
    </script>
  </body>
</html>
`;

// The advantage of script injection in a plain html is that it gives the opportunity to user to provide any
// arbitrary but a valid html file.
const htmlNoScript = `
<html>
  <head>
    <title>WebappStarter Project Preview </title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
`;



interface PreviewIframeProps {
  code: string;
  err: string;
}

const PreviewIframe:React.FC<PreviewIframeProps> = ({code, err}) => {
  const iframeRef = useRef<any>();

  useEffect(() => {
    iframeRef.current.srcdoc = injectScriptInHtml(htmlNoScript, parentCommunicationJavascriptCode);

    // To make it fool proof we should convert it to be dependent on message from iframe
    setTimeout(() => {
      iframeRef.current.contentWindow.postMessage(code, '*');
    }, 50);
  }, [code]);

  return (
    <div className="preview-wrapper">
      <iframe 
        ref={iframeRef} 
        title="preview" 
        sandbox="allow-scripts allow-modals allow-same-origin" />
      {err && <div className="preview-error">{err}</div>}
    </div>
  );
}

export default PreviewIframe;