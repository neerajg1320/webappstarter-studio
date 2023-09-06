import React, {useEffect} from "react";
import ExpandableSpan from "./espan";
import './arg-item.css';
import {getItem} from "localforage";

interface ArgValueProps {
  item: any;
  keyName: string|number;
  expanded: boolean;
  onClick: (keyName:string|number) => void
}

export const getConsoleItemType = (item:any):string => {
  return typeof(item);
}

export const ConsoleComponentMap:{[k:string]:React.FC<ArgValueProps>} = {
  "object": ({item, keyName, expanded, onClick:propOnClick}) => {
    return (
        <div className="arg-object-title" onClick={(e) => propOnClick(keyName)}>
          <span>{keyName}</span>
          <i className={"fas" +  (expanded ? " fa-caret-down" : " fa-caret-right")} />
        </div>
    );
  },
  "string": ({item}) => {
    return (
      <div>"{item}"</div>
    );
  },
  "default": ({item}) => {
    return (
        <div>{item}</div>
    );
  },
}


interface ArgItemProps {
  item: any;
  keyName: number|string;
  level: number;
  showKeyName?: boolean;
  expanded?: boolean;
  onClick?: (keyName:number|string) => void;
  getType?: (item:any) => string;
  componentMap?: {[k:string]:React.FC<ArgValueProps>}
}


const ArgItem:React.FC<ArgItemProps> = ({
                                      item,
                                      keyName,
                                      level:propLevel,
                                      showKeyName=true,
                                      expanded=false,
                                      onClick:propOnClick,
                                      getType,
                                      componentMap
                                    }) => {
  useEffect(() => {
    console.log(`componentMap:`, componentMap);
  }, [componentMap]);

  const handleExpandClick = (keyName:number|string) => {
    if (propOnClick) {
      propOnClick(keyName)
    }
  }

  let itemType:string;
  if (getType) {
    itemType = getType(item);
  } else {
    itemType = typeof(item);
  }

  if (itemType === "object") {
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

  if (itemType === "string") {
    return (
        <span>"{item}"</span>
    );
  }

  return (
      <span>{item}</span>
  );
}

export default ArgItem;