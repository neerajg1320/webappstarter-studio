import "./slider.style.scss";
import React, { useRef, useState } from "react";
import { FaMoon } from "react-icons/fa";
import { useThemeContext } from "../../../context/ThemeContext/theme.context";

const Slider = ({ size }) => {
  const [themeIcon, setThemeIcon] = useState("sun");
  const { setCurrentTheme, theme } = useThemeContext();
  const circleRef = useRef(null);

  const onToggleClick = () => {
    // console.log(circleRef.current.style);
    if (circleRef.current.classList.contains("circleLeft")) {
      circleRef.current.classList.replace("circleLeft", "circleRight");
      setThemeIcon("moon");
      setCurrentTheme("dark");
    } else {
      circleRef.current.classList.replace("circleRight", "circleLeft");
      setThemeIcon("sun");
      setCurrentTheme("light");
    }
    // console.log("click");
  };
  return (
    <div className={"sliderBox"} style={{ ...(theme as React.CSSProperties) }}>
      <div className={"sliderIcons"}>
        {/* <FontAwesomeIcon icon={faSun} size="1x" /> */}
        <FaMoon />
      </div>
      <button
        className={"outerBox"}
        style={{
          width: `calc(3*${size}rem)`,
          height: `calc(${size}rem + 0.2rem)`,
          //    borderColor: borderColor, backgroundColor: backgroundColor
        }}
        onClick={onToggleClick}
      >
        <div
          className={"circle circleLeft"}
          style={{ width: `${size}rem`, height: `${size}rem` }}
          ref={circleRef}
        >
          {/* { themeIcon} */}
        </div>
      </button>
    </div>
  );
};

export default Slider;
