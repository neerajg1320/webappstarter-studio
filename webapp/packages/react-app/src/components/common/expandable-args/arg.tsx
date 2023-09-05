import React from "react";
import ExpandableSpan from "./espan";
import './arg.css';

interface ArgProps {
  item: any;
  index: number|string;
  showIndex?: boolean;
  expanded?: boolean;
  onClick?: (index:number|string) => void;
}
const Arg:React.FC<ArgProps> = ({item, index, showIndex=true, expanded=false, onClick:propOnClick}) => {
  const handleExpandClick = (index:number|string) => {
    if (propOnClick) {
      propOnClick(index)
    }
  }

  if (typeof(item) === "object") {
    return (
        <div  className="arg-object" >
          <span onClick={(e) => handleExpandClick(index)}>
            {showIndex ? `${index}:` : ""}&gt;
          </span>
          <ExpandableSpan obj={item} level={1} expanded={expanded}/>
        </div>
    );
  }

  if (typeof(item) === "string") {
    return (
        <span>"{item}"</span>
    );
  }

  return (
      <span>{item}</span>
  );
}

export default Arg;