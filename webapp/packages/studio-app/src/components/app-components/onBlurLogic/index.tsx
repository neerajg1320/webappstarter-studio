import React, { useRef, useEffect, forwardRef } from "react";

type propTypes = {
  onClickOutside: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
  // ref: HTMLDivElement
}

const CheckOutSide = forwardRef(
  (props: propTypes, newRef: React.ForwardedRef<HTMLDivElement>) => {
    const componentRef = useRef<HTMLDivElement>(null);
    const { onClickOutside, children } = props;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(e.target as Node) 
        &&
        e.target != (newRef as React.RefObject<HTMLDivElement>).current
      ) {
        onClickOutside(false);
      }
    };

    useEffect(() => {
      console.log("CheckOutside Mount");
      document.addEventListener("click", handleClickOutside, true);

      return () => {
        console.log("CheckOutside UnMount");
        document.removeEventListener("click", handleClickOutside,true);
      };
    }, []);

    if (!children) {
      return null;
    }
    return <div ref={componentRef}>{children}</div>;
  }
);

export default CheckOutSide;
