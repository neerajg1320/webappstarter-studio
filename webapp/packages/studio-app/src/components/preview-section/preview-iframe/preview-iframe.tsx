import React, {SyntheticEvent, useEffect, useMemo, useRef, useState} from "react";
import './preview-iframe.css';
import {injectScriptInHtml} from "../../../utils/markup";
import {parentCommunicationJavascriptCode} from "./script";
import {debugComponent, debugIframeMessages} from "../../../config/global";
import {debugWindowEvent, IframeMessage} from "../message";

interface PreviewIframeProps {
  id: string;
  iteration: number,
  title: string;
  html: string;
  code: string;
  err: string;
}

const PreviewIframe:React.FC<PreviewIframeProps> = ({id, iteration, title, html, code, err}) => {
  const iframeRef = useRef<any>();
  const [isIframeInitialized, setIframeInitialized] = useState<boolean>(false);
  const debugName = useMemo<string>(() => {
    return `PreviewIframe[${title.padStart(20)}]`;
  }, [title]);

  if (debugComponent || true) {
    console.log(`${debugName} id:${id} iteration:${iteration} [${html.length}, ${code.length}]`);
  }

  useEffect(() => {
    // console.log(iframeRef.current.contentWindow);
    const handleMessage:(ev: MessageEvent<any>) => any = (event) => {
      // console.log(`handleMessage:`, event.source, event.source === iframeRef.current.contentWindow);
      // debugWindowEvent(event);

      if (!iframeRef.current) {
        // TBD: Sometimes we are reaching here even when iframeRef.current is null
        console.log(`${debugName} useEffect[] handleMessage: iframe.current is '${iframeRef.current}' for '${title}'`, event)
        return;
      }

      // We return from here if the response is not from the iframe that this component created
      if (event.source !== iframeRef.current.contentWindow) {
        return;
      }

      const {source, type} = event.data as IframeMessage;
      if ((source && source === "iframe") && (type && type === "init")) {
        if (!isIframeInitialized) {
          console.log(`${debugName} setting iframe initialized.`, event.data);
          setIframeInitialized(true);
        }
      }
    };

    window.addEventListener('message', handleMessage, false);
    if (debugComponent || true) {
      console.log(`${debugName} useEffect[] 'message' event listener added.`)
    }

    return () => {
      window.removeEventListener('message', handleMessage)
      if (debugComponent || true) {
        console.log(`${debugName} useEffect[]:destroy 'message' event listener removed.`)
      }
    }
  }, []);

  useEffect(() => {
    if (debugComponent) {
      console.log(`PreviewIframe: html:`, html);
    }

    if (!iframeRef.current) {
      console.log(`${debugName} useEffect[html] iframe.current is '${iframeRef.current}' for '${title}'`)
      return;
    }

    // Updating the srcdoc is necessary to reset the code in the iframe.
    // However it still does not reset the style information present in the iframe.
    console.log(`PreviewIframe[${title.padStart(20)}] useEffect[html] injected communication script in html`);
    const hydratedHtml = injectScriptInHtml(html, parentCommunicationJavascriptCode(title));
    iframeRef.current.srcdoc = hydratedHtml;
    console.log(`PreviewIframe[${title.padStart(20)}] useEffect[html] set the hydratedHtml (length:${hydratedHtml.length}) in iframe.srcdoc`);

  }, [html])

  useEffect(() => {
    console.log(`${debugName} useEffect[...] isIframeInitialized=${isIframeInitialized} code.length=${code && code.length}`);

    if (!iframeRef.current) {
      console.log(`handleMessage: iframe.current is '${iframeRef.current}' for '${title}'`)
      return;
    }

    if (!isIframeInitialized) {
      return;
    }

    // We reload the iframe and then send the code message in onLoad
    iframeRef.current.contentWindow.location.reload(true);

    if (debugIframeMessages || true) {
      console.log(`${debugName} useEffect[code, isIframeInitialized, iteration] code size of ${code.length} bytes sent to iframe`);
    }
  }, [code, isIframeInitialized, iteration]);

  const handleIframeOnLoad = (event: SyntheticEvent) => {
    console.log(`${debugName} handleIframeLoad`, event);

    const codeMessage:IframeMessage = {
      source: 'main',
      type: 'code',
      content: {id, code}
    };
    iframeRef.current.contentWindow.postMessage(codeMessage, '*');
  }

  return (
    <div className="preview-iframe">
      <iframe
        id={id}
        ref={iframeRef} 
        title={title + iteration.toString()}
        onLoad={handleIframeOnLoad}
        sandbox="allow-scripts allow-modals allow-same-origin" />
    </div>
  );
}

export default React.memo(PreviewIframe);