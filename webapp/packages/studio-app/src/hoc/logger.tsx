import React, {useEffect, useRef, useCallback} from 'react';


export const withLifecyleLogger = (InnerComponent, debug=true) => {
  // Create the outer component
  const WithLifeCycleLogger = (props) => {
    const renderCountRef = useRef<number>(0);

    const logEvent = useCallback((message) => {
      if (debug) {
        console.log(`Component '${InnerComponent.name}'[${renderCountRef.current}] ${message}`);
      }
    }, []);

    useEffect(() => {
      logEvent('mounted');

      return () => {
        logEvent('destroyed');
      }
    }, []);

    renderCountRef.current += 1;
    logEvent('rendered');

    return <InnerComponent {...props} />
  };

  return WithLifeCycleLogger;
}
