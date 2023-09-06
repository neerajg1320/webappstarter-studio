import React from "react";
import ExpandableSpan from "./espan";
import './arg-item.css';

interface ArgProps {
  item: any;
  keyName: number|string;
  level: number;
  showKeyName?: boolean;
  expanded?: boolean;
  onClick?: (keyName:number|string) => void;
}

const ArgItem:React.FC<ArgProps> = ({
                                      item,
                                      keyName,
                                      level:propLevel,
                                      showKeyName=true,
                                      expanded=false,
                                      onClick:propOnClick
                                    }) => {
  const handleExpandClick = (keyName:number|string) => {
    if (propOnClick) {
      propOnClick(keyName)
    }
  }

  if (typeof(item) === "object") {
    return (
        <div  className="arg-object" >
          <div className="arg-object-title" onClick={(e) => handleExpandClick(keyName)}>
            {showKeyName && <span>{keyName}</span>}
            <i className={"fas" +  (expanded ? " fa-caret-down" : " fa-caret-right")} />
          </div>
          <ExpandableSpan obj={item} level={propLevel + 1} expanded={expanded}/>
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

export default ArgItem;