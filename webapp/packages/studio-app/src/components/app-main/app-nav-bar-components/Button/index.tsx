// import * as React from "react";
import "./button.css";
type propTypes = {
  title: string;
  buttonClass: string;
  children ?: React.ReactNode
};

const Button = ({ title, buttonClass, children }: propTypes) => {
  return (
    <button
      className={`font-bold ${buttonClass}`}
    >
      {title} {children}
    </button>
  );
};

export default Button;
