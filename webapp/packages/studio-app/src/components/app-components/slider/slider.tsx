import "./slider.style.scss";
import React, { forwardRef, useRef, useState } from "react";
import { FaMoon } from "react-icons/fa";
import { useThemeContext } from "../../../context/ThemeContext/theme.context";

interface SliderProps {
  size: number;
  toggle: boolean;
  onToggleClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, ref: React.RefObject<HTMLDivElement>, sliderOuterBoxRef?: React.RefObject<HTMLButtonElement>)=>void;
}

const Slider: React.FC<SliderProps> = ({ size, toggle, onToggleClick}) => {
 
  const circleRef = useRef(null);
  const sliderOuterBoxRef = useRef(null);

 
  return (
    <div className={"sliderBox"} >
      {!toggle && <div className={"sliderIcons"}>
        {/* <FontAwesomeIcon icon={faSun} size="1x" /> */}
        <FaMoon />
      </div>}
      <button
        className={"outerBox"}
        style={{
          width: `calc(3*${size}rem)`,
          height: `calc(${size}rem + 0.2rem)`,
          //    borderColor: borderColor, backgroundColor: backgroundColor
        }}
        onClick={(e)=>onToggleClick(e, circleRef, sliderOuterBoxRef)}
        ref={sliderOuterBoxRef}
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
