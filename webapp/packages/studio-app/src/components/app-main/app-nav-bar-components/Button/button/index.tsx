// import * as React from "react";
import "./button.css";

type propTypes = {
  title: string;
  buttonClass: string;
  children ?: React.ReactNode;
  handleButtonClick ?: (e?:any)=>void;
  buttonType: "button" | "submit" | "reset"
};

const Button = ({ title, buttonClass, children, handleButtonClick, buttonType }: propTypes) => {
  return (
    <button
      className={`${buttonClass}`}
      onClick={handleButtonClick}
      type= {buttonType}
    >
      {title} {children}
    </button>
  );
};

export default Button;
