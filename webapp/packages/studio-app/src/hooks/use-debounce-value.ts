import {useEffect, useRef, useState} from "react";

// Ref: https://www.telerik.com/blogs/how-to-create-custom-debounce-hook-react
// The solution in the reference is javascript based.
const useDebounceValue = <T> (value:T, delay:number):T => {
  const debugComponentLifecycle = false;
  const debugComponent = false;

  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (debugComponentLifecycle) {
      console.log(`useDebounce:useEffect[] value='${value}' delay=${delay}`);
    }

    return () => {
      if (debugComponentLifecycle) {
        console.log(`useDebounce: destroyed`);
      }
    }
  }, []);

  useEffect(() => {
    if (debugComponent) {
      console.log(`useDebounce:useEffect[value,delay] value='${value}' delay=${delay}`);
    }
    timerRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      if (debugComponent) {
        console.log(`useDebounce:useEffect[value,delay] destroyed`);
      }
      clearTimeout(timerRef.current)
    }
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounceValue;