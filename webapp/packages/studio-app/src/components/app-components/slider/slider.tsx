import "./slider.style.scss";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { FaMoon } from "react-icons/fa";
import { useThemeContext } from "../../../context/ThemeContext/theme.context";

interface SliderProps {
  size: number;
  toggle: boolean;
  onToggleClick: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ref: React.RefObject<HTMLDivElement>,
    sliderOuterBoxRef?: React.RefObject<HTMLButtonElement>
  ) => void;
  circlePosition: boolean;
}

const Slider: React.FC<SliderProps> = ({
  size,
  toggle,
  onToggleClick,
  circlePosition,
}) => {
  const circleRef = useRef(null);
  const sliderOuterBoxRef = useRef(null);

  useEffect(() => {
    if (circleRef) {
      if (circlePosition) {
        circleRef?.current.classList.add("circleLeft");
      } else {
        if (toggle) {
          sliderOuterBoxRef.current.classList.add("toggleOffBorder");
          circleRef.current.classList.add("toggleOff");
        }
        circleRef?.current.classList.add("circleRight");
      }
    }
  }, []);

  return (
    <div className={"sliderBox"}>
      {!toggle && (
        <div className={"sliderIcons"}>
          {/* <FontAwesomeIcon icon={faSun} size="1x" /> */}
          <FaMoon />
        </div>
      )}
      <button
        className={"outerBox"}
        style={{
          width: `calc(3*${size}rem)`,
          height: `calc(${size}rem + 0.2rem)`,
          //    borderColor: borderColor, backgroundColor: backgroundColor
        }}
        onClick={(e) => onToggleClick(e, circleRef, sliderOuterBoxRef)}
        ref={sliderOuterBoxRef}
      >
        <div
          className={"circle "}
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
