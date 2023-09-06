import React, {useEffect} from "react";
import './arg-item.css';
import ExpandableSpan from "./espan";

interface ArgValueProps {
  item: any;
  keyName?: string|number;
  expanded?: boolean;
  onClick?: (keyName:string|number) => void
}

export const getConsoleItemType = (item:any):string => {
  return typeof(item);
}

const ArgObjectItem:React.FC<ArgValueProps> = ({item, keyName, expanded, onClick:propOnClick}) => {
  return (
      <div className="arg-object-title" onClick={(e) => {
        if (keyName && propOnClick) {
          propOnClick(keyName)
        }
      }}>
        <span>{keyName}</span>
        <i className={"fas" +  (expanded ? " fa-caret-down" : " fa-caret-right")} />
      </div>
  );
};

const ArgStringItem:React.FC<ArgValueProps> = ({item}) => {
  return (
      <div>"{item}"</div>
  );
}

const ArgDefaultItem:React.FC<ArgValueProps> = ({item}) => {
  return (
      <div>{item}</div>
  );
}

export const consoleComponentMap:{[k:string]:React.FC<ArgValueProps>} = {
  "object": ArgObjectItem,
  "string": ArgStringItem,
  "default": ArgDefaultItem,
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
                                      expanded:propExpanded=false,
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
  const _getItemType = getType || getConsoleItemType;
  const _itemComponentMap = componentMap || consoleComponentMap;

  let itemType:string = _getItemType(item);
  let itemComponent:React.FC<ArgValueProps> = _itemComponentMap[itemType];


  if (itemType === "object") {
    return (
        <div  className="arg-object" >
          <ArgObjectItem item={item} keyName={keyName} expanded={propExpanded} onClick={(e) => handleExpandClick(keyName)}/>
          <ExpandableSpan obj={item} level={propLevel + 1} expanded={propExpanded}/>
        </div>
    );
  }

  if (itemType === "string") {
    return (
        <ArgStringItem item={item} />
    );
  }

  return (
      <ArgDefaultItem item={item} />
  );

  // return React.createElement(itemComponent, {item, keyName, expanded:propExpanded, onClick:handleExpandClick}, null );
}

export default ArgItem;