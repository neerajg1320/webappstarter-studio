export const parentCommunicationJavascriptCode = (title:string) => { return `
    const window_console_log = window.console.log;
    const window_console_error = window.console.error;
    const flagDebugIframe = false;
    const debugName = \`iframe       [${title.padStart(20)}]\`;
    
    window.console.log = function(...args) {
      // We save the console.log function before we override it
      window_console_log(debugName, ...args);
      
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
         
        try {
          if (flagDebugIframe) {
            console.log(\`$\{debugName\} eval(code) code.length:$\{code.length\} bytes received from parent\`, event.data);
          }
          eval(code);
          const evalFinished = { source: "iframe", type: 'eval-finished', content: ['Eval Finsihed'] }
          window.parent.postMessage(evalFinished, '*');
          if (flagDebugIframe) {    
            console.log(\`$\{debugName\}: posted the evalFinished to parent\`);
          }                     
        } catch (err) {
          handleError(err);
        }                
      }
    }, false);
    
    // TBD: We have to resolve browser messaging issues!
    const initMessage = { source: "iframe", type: 'init', content: ['Initialized'] }  
    
    // This is subscribed to by the preview-iframe
    // We will try and use onLoad as we are getting the message twice
        
    // Temporary disabled
    window.parent.postMessage(initMessage, '*');
    if (flagDebugIframe) {    
      console.log(\`$\{debugName\}: posted the initMessage to parent\`);
    }
`;
};

export const simpleJavascriptCode = `
    console.log('hello from script');
    console.log('would you talk to me');
`;