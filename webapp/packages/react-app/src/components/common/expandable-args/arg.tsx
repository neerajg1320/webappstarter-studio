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
          <div className="arg-object-title" onClick={(e) => handleExpandClick(index)}>
            {showIndex && <span>{index}</span>}
            <i className={"fas" +  (expanded ? " fa-caret-down" : " fa-caret-right")} />
          </div>
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