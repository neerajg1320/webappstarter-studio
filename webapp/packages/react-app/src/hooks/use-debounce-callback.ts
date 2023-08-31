import {useCallback, useEffect, useRef, useState} from "react";

// Ref: https://www.telerik.com/blogs/how-to-create-custom-debounce-hook-react
// The solution in the reference is javascript based.
const useDebounceCallback = <CB extends () => any> (callback:CB, delay:number) => {
   const debugComponentLifecycle = true;
   const debugComponent = true;

  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (debugComponentLifecycle) {
      console.log(`useDebounce:useEffect[] delay=${delay}`);
    }

    return () => {
      console.log(`useDebounce: destroyed`);
    }
  }, []);

  const debouncedCallback = useCallback(() => {
    if (debugComponent) {
      console.log(`useDebounce:useCallback[callback,delay] delay=${delay}`);
    }
    timerRef.current = setTimeout(() => {
      callback();
    }, delay);

    return () => {
      if (debugComponent) {
        console.log(`useDebounce:useCallback[value,delay] destroyed`);
      }
      clearTimeout(timerRef.current);
    }
  }, [callback, delay]);

  return debouncedCallback;
}

export default useDebounceCallback;