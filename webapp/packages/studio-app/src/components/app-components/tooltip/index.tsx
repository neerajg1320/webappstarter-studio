import React, { useState } from "react";
import "./tooltip.css";

type propTypes = {
  children: React.ReactNode;
  position: string;
  msg: string;
  tip: boolean;
};

const Tooltip = ({ children, position, msg, tip }: propTypes) => {
  const [isToolTipVisible, setIsToolTipVisible] = useState<boolean>(false);
  const [dimension, setDimension] = useState<{
    width: number;
    height: number;
  }>({
    width: 0,
    height: 0,
  });

  let timeOut;

  const onMouseOver = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { offsetWidth, offsetHeight } = e.currentTarget;
    timeOut = setTimeout(() => {
      setIsToolTipVisible(true);
      // console.log("hello");
    }, 200);
    setDimension({
      ...dimension,
      width: offsetWidth + 10,
      height: offsetHeight + 10,
    });
    // console.log(offsetHeight, offsetWidth);
  };

  const onMouseLeave = () => {
    setTimeout(() => {
      setIsToolTipVisible(false);
    }, 200);
  };
  console.log(isToolTipVisible);

  const onTooltipClick = () => {
    console.log("click tooltip");
    setIsToolTipVisible(false);
    // setIsToolTipVisible(true);
  };

  return (
    <div
      className="wrapper"
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
      onClick={onTooltipClick}
    >
      {children}

      {isToolTipVisible && position == "bottom" && (
        <div className="tooltip" style={{ top: `${dimension.height}px` }}>
          {tip && <div className="tip tipbottom"></div>}
          {msg}
        </div>
      )}
      {isToolTipVisible && position == "top" && (
        <div
          className="tooltip tooltiptop"
          style={{ top: `-${dimension.height}px` }}
        >
          {tip && <div className="tip tiptop"></div>}
          {msg}
        </div>
      )}

      {isToolTipVisible && position === "left" && (
        <div
          className="tooltip tooltipleft"
          style={{ right: `${dimension.width}px` }}
        >
          {tip && <div className="tip tipleft"></div>}
          {msg}
        </div>
      )}

      {isToolTipVisible && position == "right" && (
        <div
          className="tooltip tooltipright"
          style={{ right: `-${dimension.width}px` }}
        >
          {tip && <div className="tip tipright"></div>}
          {msg}
        </div>
      )}

      {/* {isToolTipVisible && position == "top-right" && <div className="tooltip tooltiptopright">
    <div className="tip tiptopright">
    </div>
    {msg}
    </div>}

     {isToolTipVisible && position == "bottom-right" && <div className="tooltip tooltipbottomright">
    <div className="tip tipbottomright">
    </div>
    {msg}
    </div>}

     {isToolTipVisible && position == "top-left" && <div className="tooltip tooltiptopleft">
    <div className="tip tiptopleft">
    </div>
    {msg}
    </div>}

     {isToolTipVisible && position == "bottom-left" && <div className="tooltip tooltipbottomleft">
    <div className="tip tipbottomleft">
    </div>
    {msg}
    </div>}

    {isToolTipVisible && position == "left-top" && <div className="tooltip tooltiplefttop">
    <div className="tip tiplefttop">
    </div>
    {msg}
    </div>}

    {isToolTipVisible && position == "left-bottom" && <div className="tooltip tooltipleftbottom">
    <div className="tip tipleftbottom">
    </div>
    {msg}
    </div>}

    {isToolTipVisible && position == "right-top" && <div className="tooltip tooltiprighttop">
    <div className="tip tiprighttop">
    </div>
    {msg}
    </div>}

    {isToolTipVisible && position == "right-bottom" && <div className="tooltip tooltiprightbottom">
    <div className="tip tiprightbottom">
    </div>
    {msg}
    </div>} */}
    </div>
  );
};

export default Tooltip;
