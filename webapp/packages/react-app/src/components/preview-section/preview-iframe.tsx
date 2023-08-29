import './preview-iframe.css';
import {useEffect, useRef, useState} from "react";

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


interface PreviewProps {
  code: string;
  err: string;
}

const htmlNoScript = `
<html>
  <head>
    <title>HTML No Script</title>
    <style>html {background-color: white}</style>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
`;


const PreviewIframe:React.FC<PreviewProps> = ({code, err}) => {
  const iframeRef = useRef<any>();
  const [markup, setMarkup] = useState<string>("");

  const parseHtml = (markupStr:string):string => {
    let resultMarkupStr = "Not processed";

    var detachedHtml = document.createElement( 'html' );
    // el.innerHTML = "<html><head><title>titleTest</title></head><body><a href='test0'>test01</a><a href='test1'>test02</a><a href='test2'>test03</a></body></html>";
    // const elements = el.getElementsByTagName( 'a' ); // Live NodeList of your anchor elements
    detachedHtml.innerHTML = htmlNoScript;

    const titleEl = detachedHtml.getElementsByTagName('title');
    if (titleEl.length > 0) {
      setMarkup(titleEl[0].innerText);
    }

    const bodyEl = detachedHtml.getElementsByTagName('body');
    if (bodyEl.length > 0) {
      const scriptEl = document.createElement('script');
      scriptEl.innerText = "console.log('hello from script')"

      bodyEl[0].appendChild(scriptEl);
    }

    resultMarkupStr = detachedHtml.innerHTML;
    setMarkup(resultMarkupStr);

    return resultMarkupStr;
  }

  useEffect(() => {
    const htmlWithInjectedScript = parseHtml(htmlNoScript);

    iframeRef.current.srcdoc = htmlWithScript;
    // iframeRef.current.srcdoc = htmlWithInjectedScript;


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
      <pre>{markup}</pre>
    </div>
  );
}

export default PreviewIframe;