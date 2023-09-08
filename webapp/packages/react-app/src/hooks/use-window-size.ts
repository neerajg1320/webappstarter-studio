import React, {useEffect, useState} from "react";
import useDebouncedCallback from "./use-debounced-callback";

export type WindowSize = {width:number|undefined, height:number|undefined};

const useWindowSize = (debounceTimeoutMs:number=200) => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined
  });

  // The horizontal resize event occur a lot more than vertical.
  // In any case we should use the debounceß
  const handleResizeEvent = (event:UIEvent) => {
    console.log(`event.type:${event.type}`);

    // This set here causes re-render in the calling component
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    })
  }

  const handleDebouncedResizeEvent = useDebouncedCallback(handleResizeEvent, debounceTimeoutMs);

  const handleMouseDown = () => {
    console.log(`Mouse Down`);
  }

  // Mouse move works only when mouse moves inside of window
  const handleMouseMove = () => {
    console.log(`Mouse Move`);
  }

  const handleMouseUp = () => {
    console.log(`Mouse Up`);
  }
  // Setup listener on mount
  useEffect(() => {
    window.addEventListener("resize", handleDebouncedResizeEvent);
    // document.addEventListener("mousedown", handleMouseDown);
    // window.addEventListener("mousemove", handleMouseMove);
    // window.addEventListener("mouseup", handleMouseUp);

    // Destroy listener on unmount
    return () => {
      window.removeEventListener("resize", handleResizeEvent)
      // document.removeEventListener("mousedown", handleMouseDown);
      // window.removeEventListener("mousemove", handleMouseMove);
      // window.removeEventListener("mouseup", handleMouseUp);
    }
  }, []);

  return windowSize;
}

export default useWindowSize;