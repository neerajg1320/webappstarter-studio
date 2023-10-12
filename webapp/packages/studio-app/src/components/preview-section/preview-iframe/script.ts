export const parentCommunicationJavascriptCode = (title:string) => {
  return `
    const window_console_log = window.console.log;
    const window_console_error = window.console.error;
    
    window.console.log = function(...args) {
      // We save the console.log function before we override it
      window_console_log(...args);
      
      // This is part of a string which contains javascript hence we are not using typescript
      const logMessage = {
        source: "iframe",
        type: 'log',
        content: args, // args is an array
      }
      
      // This is subscribed to by the preview-console
      window.parent.postMessage(logMessage, '*');
    }
    
    // TBD: Need to verify the flow here
    const handleError = (err) => {
      // TBD: We can look for all divs or all elements with id specified and then announce the error.
      const root = document.querySelector('#root');
      if (root) {
        root.innerHTML = '<div style="color:red"><h4>Runtime Error:</h4>' + err + '</div>';
      }
      if (err) {
        // This is causing problem
        window_console_error(err);
      }
      
      const errorMessage = {
        source: "iframe",
        type: 'error',
        // TBD: We have to resolve browser messaging issues!
        content: err ? err : {message: "err is null"},
      }
      
      // This is subscribed to by the preview-console
      window.parent.postMessage(errorMessage, '*');
    };

    window.addEventListener('error', (event) => {
      event.preventDefault();
      handleError(event.error);
    });

    window.addEventListener('message', (event) => {
      const {source, type, content} = event.data;
      
      if ((type === 'code') && (source === 'main')) { 
        const {id, code} = content;
        console.log(\`iframe[${title.padStart(20)}]: code size of $\{code.length\} bytes received from parent\`, event.data);
         
        try {
          eval(code);
        } catch (err) {
          handleError(err);
        }                
      }
    }, false);
    
    const iframeElement = document.querySelector("#root");
    // console.log(Object.create(iframeElement));
    
    // console.log('Parent Communicated Script Injected');
    const initMessage = {
      source: "iframe",
      type: 'init',
      // TBD: We have to resolve browser messaging issues!
      content: ['Initialized'],
    }  
    
    // This is subscribed to by the preview-iframe
    window.parent.postMessage(initMessage, '*');    
`;
};

export const simpleJavascriptCode = `
    console.log('hello from script');
    console.log('would you talk to me');
`;