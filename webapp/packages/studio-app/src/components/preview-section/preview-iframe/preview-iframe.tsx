import React, {SyntheticEvent, useCallback, useEffect, useMemo, useRef, useState} from "react";
import './preview-iframe.css';
import {injectScriptInHtml} from "../../../utils/markup";
import {parentCommunicationJavascriptCode} from "./script";
import {debugComponent, debugIframeMessages, enableConsole} from "../../../config/global";
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
  // const debugComponent = true;
  const debugAlarms = false
  const iframeRef = useRef<any>();
  const enableReloadRef = useRef<boolean>(false);

  // The setIframeInitialized might be redundant as we are posting code in onLoad
  const [isIframeInitialized, setIframeInitialized] = useState<boolean>(false);
  const debugName = useMemo<string>(() => {
    return `PreviewIframe[${title.padStart(20)}]`;
  }, [title]);

  if (debugComponent) {
    console.log(`${debugName} id:${id} iteration:${iteration} [${html.length}, ${code.length}]`);
  }

  useEffect(() => {
    if (debugComponent) {
      console.log(`${debugName}: mounted`);
    }

    const handleMessage:(ev: MessageEvent<any>) => any = (event) => {
      if (!iframeRef.current) {
        // TBD: Sometimes we are reaching here even when iframeRef.current is null
        if (debugAlarms) {
          console.log(`${debugName} useEffect[] handleMessage: iframe.current is '${iframeRef.current}' for '${title}'`, event)
        }
        return;
      }

      // We return from here if the response is not from the iframe that this component created
      if (event.source !== iframeRef.current.contentWindow) {
        return;
      }

      const {source, type} = event.data as IframeMessage;
      if ((source && source === "iframe")) {
        if (type && type === "init") {
          if (!isIframeInitialized) {
            if (debugComponent) {
              console.log(`${debugName} setting iframe initialized.`, event.data);
            }
            setIframeInitialized(true);
          }
        } else if (type && type === "eval-finished") {
          // We enable the iframe reload after first eval is finished
          enableReloadRef.current = true;

          if (debugComponent) {
            console.log(`${debugName} iframe reload enabled.`, event.data);
          }
        }
      }
    };

    window.addEventListener('message', handleMessage, false);
    if (debugComponent) {
      console.log(`${debugName} useEffect[] 'message' event listener added.`)
    }

    return () => {
      window.removeEventListener('message', handleMessage)
      if (debugComponent) {
        console.log(`${debugName} useEffect[]:destroy 'message' event listener removed.`)
      }
    }
  }, []);

  useEffect(() => {
    if (!iframeRef.current) {
      if (debugAlarms) {
        console.log(`${debugName} useEffect[html] iframe.current is '${iframeRef.current}' for '${title}'`)
      }
      return;
    }

    // Updating the srcdoc is necessary to reset the code in the iframe.
    // However it still does not reset the style information present in the iframe.
    if (debugComponent) {
      console.log(`PreviewIframe[${title.padStart(20)}] useEffect[html] injected communication script in html`);
    }
    const hydratedHtml = injectScriptInHtml(html, parentCommunicationJavascriptCode(title, enableConsole));
    iframeRef.current.srcdoc = hydratedHtml;
    if (debugComponent) {
      console.log(`PreviewIframe[${title.padStart(20)}] useEffect[html] set the hydratedHtml (length:${hydratedHtml.length}) in iframe.srcdoc`);
    }
  }, [html])

  useEffect(() => {
    if (debugComponent) {
      console.log(`${debugName} useEffect[code, isIframeInitialized, iteration] isIframeInitialized=${isIframeInitialized} code.length=${code && code.length} iteration:${iteration}`);
    }

    if (!iframeRef.current) {
      if (debugAlarms) {
        console.log(`handleMessage: iframe.current is '${iframeRef.current}' for '${title}'`)
      }
      return;
    }

    // Can be temporarily disabled
    if (!isIframeInitialized) {
      if (debugAlarms) {
        console.log(`${debugName} useEffect[code, isIframeInitialized, iteration] isIframeInitialized:${isIframeInitialized}`);
      }
      return;
    }

    // We avoid reload the when we create the iframe. Hence it is disabled by default
    // We enable the reload when we get the first onLoad callback in handleIframeOnLoad
    if (enableReloadRef.current) {
      iframeRef.current.contentWindow.location.reload(true);
      if (debugIframeMessages) {
        console.log(`${debugName} useEffect[code, isIframeInitialized, iteration] iframe reload called`);
      }
    }
  }, [code, isIframeInitialized, iteration]);

  const handleIframeOnLoad = useCallback((event: SyntheticEvent) => {
    if (debugComponent) {
      console.log(`${debugName} handleIframeLoad`, event);
    }

    const codeMessage:IframeMessage = {
      source: 'main',
      type: 'code',
      content: {id, code}
    };
    iframeRef.current.contentWindow.postMessage(codeMessage, '*');
  }, [code]);

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