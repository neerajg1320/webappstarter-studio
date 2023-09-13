import {useCallback, useEffect, useRef, useState} from "react";


const useDifferentialCallback = <CB extends (e:any) => any> (callback:CB) => {
  const debugComponentLifecycle = false;
  const debugComponent = false;

  // const timerRef = useRef<NodeJS.Timeout>();
  const prevArg = useRef<any>(null);


  // useEffect(() => {
  //   if (debugComponentLifecycle) {
  //     console.log(`useDebounce:useEffect[] delay=${delay}`);
  //   }
  //
  //   return () => {
  //     if (debugComponentLifecycle) {
  //       console.log(`useDebounce: destroyed`);
  //     }
  //   }
  // }, []);


  const diffCallback = useCallback((e:any) => {
    if (debugComponent) {
      console.log(`useDebounce:useCallback[callback,delay] delay=${delay}`);
    }

    if (prevArg.current !== e) {
      callback(e);
      prevArg.current = e;
    }
    // if (timerRef.current) {
    //   if (debugComponent) {
    //     console.log(`useDebounce:render Existing timer cleared`);
    //   }
    //   clearTimeout(timerRef.current);
    // }

    // timerRef.current = setTimeout(() => {
    //   callback(e);
    // }, delay);
  }, [callback]);

  return diffCallback;
}

export default useDifferentialCallback;