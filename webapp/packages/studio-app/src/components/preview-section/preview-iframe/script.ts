export const simpleJavascriptCode = `
    console.log('hello from script');
    console.log('would you talk to me');
`;

export const parentCommunicationJavascriptCode = `
    const window_console_log = window.console.log;
    const window_console_error = window.console.error;
    
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
      // TBD: We can look for all divs or all elements with id specified and then announce the error.
      const root = document.querySelector('#root');
      if (root) {
        root.innerHTML = '<div style="color:red"><h4>Runtime Error:</h4>' + err + '</div>';
      }
      if (err) {
        // This is causing problem
        window_console_error(err);
      }
      
      const message = {
        source: "iframe",
        type: 'error',
        // TBD: We have to resolve browser messaging issues!
        content: err ? err : {message: "err is null"},
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
    
    // console.log('Parent Communicated Script Injected');
`;


