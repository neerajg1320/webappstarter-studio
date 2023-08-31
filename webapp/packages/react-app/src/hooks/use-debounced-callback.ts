import {useCallback, useEffect, useRef, useState} from "react";

// Ref: https://www.telerik.com/blogs/how-to-create-custom-debounce-hook-react
// The solution in the reference is javascript based.
const useDebouncedCallback = <CB extends () => any> (callback:CB, delay:number) => {
   const debugComponentLifecycle = false;
   const debugComponent = false;

  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (debugComponentLifecycle) {
      console.log(`useDebounce:useEffect[] delay=${delay}`);
    }

    return () => {
      if (debugComponentLifecycle) {
        console.log(`useDebounce: destroyed`);
      }
    }
  }, []);


  const debouncedCallback = useCallback(() => {
    if (debugComponent) {
      console.log(`useDebounce:useCallback[callback,delay] delay=${delay}`);
    }

    if (timerRef.current) {
      if (debugComponent) {
        console.log(`useDebounce:render Existing timer cleared`);
      }
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      callback();
    }, delay);
  }, [callback, delay]);

  return debouncedCallback;
}

export default useDebouncedCallback;