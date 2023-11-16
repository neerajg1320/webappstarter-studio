// import * as React from "react";
import "./button.css";
type propTypes = {
  title: string;
  buttonClass: string;
};

const Button = ({ title, buttonClass }: propTypes) => {
  return (
    <button
      className={`font-bold ${buttonClass}`}
    >
      {title}
    </button>
  );
};

export default Button;
