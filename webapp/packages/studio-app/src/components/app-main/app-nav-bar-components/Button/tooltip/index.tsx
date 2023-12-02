import React, {useState} from 'react';
import "./tooltip.css"

type propTypes = {
    children: React.ReactNode;
    position: string;
    msg: string;
}

const Tooltip = ({children, position, msg}:propTypes) => {
  const [isToolTipVisible, setIsToolTipVisible] = useState<boolean>(false)

  const onMouseOver = ()=>{
  setIsToolTipVisible(true);
}

const onMouseLeave = ()=>{
  setIsToolTipVisible(false);
}

const onTooltipClick = ()=>{
  // setIsToolTipVisible(false);
  setIsToolTipVisible(true);
}

  return (
    <div className="wrapper" onMouseOver={onMouseOver} onMouseLeave={onMouseLeave} onClick={onTooltipClick}>
    {children}

    {isToolTipVisible && position == "bottom" && <div className="tooltip">
    <div className="tip">
    </div>
    {msg}
    </div>}
    {isToolTipVisible && position == "top" && <div className="tooltip tooltiptop">
    <div className="tip tiptop">
    </div>
    {msg}
    </div>}

    {isToolTipVisible && position === "left" && <div className="tooltip tooltipleft">
    <div className="tip tipleft">
    </div>
    {msg}
    </div>}

    {isToolTipVisible && position == "right" && <div className="tooltip tooltipright">
    <div className="tip tipright">
    </div>
    {msg}
    </div>}

     {isToolTipVisible && position == "top-right" && <div className="tooltip tooltiptopright">
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
    </div>}
    </div>
  );
};

export default Tooltip;