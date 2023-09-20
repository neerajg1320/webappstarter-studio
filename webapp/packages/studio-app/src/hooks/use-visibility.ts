import {useEffect, useMemo, useState} from "react";

const useVisibility = (ref) => {
  const debugComponentLifecycle = false;
  const debugComponent = false;

  const [isIntersecting, setIntersecting] = useState<boolean>(false);

  const observer = useMemo(() => {
    return new IntersectionObserver(([entry]) => {
      setIntersecting(entry.isIntersecting);
    });
  }, []);

  useEffect(() => {
    if (debugComponentLifecycle) {
      console.log(`useVisibility:useEffect[ref, observer]`);
    }
    observer.observe(ref.current);

    return () => {
      if (debugComponentLifecycle) {
        console.log(`useVisibility:useEffect[ref, observer] destroyed`);
      }
      observer.disconnect();
    }
  }, [ref, observer]);

  // console.log(`useVisibility:render ref:`, ref.current);

  return isIntersecting;
};

export default useVisibility;