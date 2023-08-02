// Code kept for reference
// Not working

import React from "react";

export interface EnterBlurInputProps {
  label: string;
};

const EnterBlurInput = React.forwardRef<HTMLInputElement, EnterBlurInputProps>((props, ref) => {
  return (
    <input ref={ref} {...props}/>
  );
});

export default EnterBlurInput;