import React, {useEffect} from "react";
import './arg-item.css';
import ExpandableSpan from "./espan";

export interface ArgValueProps {
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
  showKeyName?: boolean;
  expanded?: boolean;
  onClick?: (keyName:number|string) => void;
  getType?: (item:any) => string;
  componentMap?: {[k:string]:React.FC<ArgValueProps>}
}


const ArgItem:React.FC<ArgItemProps> = ({
                                      item,
                                      keyName,
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
  const getItemType = getType || getConsoleItemType;
  const itemComponentMap = componentMap || consoleComponentMap;

  let itemType:string = getItemType(item);

  if (!Object.keys(itemComponentMap).includes(itemType)) {
    itemType = "default";
  }

  let props:ArgValueProps = {item};
  if (itemType === "object") {
    props = {...props, keyName, expanded:propExpanded, onClick:handleExpandClick}
  }

  // https://stackoverflow.com/questions/29875869/react-jsx-dynamic-component-name
  // React createElement expects string or a React class as first element
  return React.createElement(itemComponentMap[itemType], props, null);
}

export default ArgItem;