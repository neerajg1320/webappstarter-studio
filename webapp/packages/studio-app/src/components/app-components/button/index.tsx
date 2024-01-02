// import * as React from "react";
import { CSSProperties } from "react";
import { useThemeContext } from "../../../context/ThemeContext/theme.context";
import "./button.css";

type propTypes = {
  title: string;
  buttonClass: string;
  children ?: React.ReactNode;
  handleButtonClick ?: (e?:any)=>void;
  buttonType: "button" | "submit" | "reset";
  disable?: boolean;
};

const Button = ({ title, buttonClass, children, handleButtonClick, buttonType, disable }: propTypes) => {

  const {theme} = useThemeContext();
  return (
    <button
      className={`${buttonClass}`}
      onClick={handleButtonClick}
      type= {buttonType}
      disabled={disable}
      // style={{...theme as CSSProperties}}
    >
      {title} {children}
    </button>
  );
};

export default Button;
