import React from "react";
import ExpandableSpan from "./espan";
import './arg.css';

interface ArgProps {
  item: any;
  index: number;
  expanded: boolean;
  onClick?: (index:number) => void;
}
const Arg:React.FC<ArgProps> = ({item, index, expanded, onClick:propOnClick}) => {
  const handleExpandClick = (index:number) => {
    if (propOnClick) {
      propOnClick(index)
    }
  }

  if (typeof(item) === "object") {
    return (
        <div  className="arg-object" >
          <span onClick={(e) => handleExpandClick(index)}>{index}:&gt;</span>
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