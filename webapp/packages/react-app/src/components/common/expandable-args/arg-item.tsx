import React, {useEffect} from "react";
import './arg-item.css';
import {debugComponent} from "../../../config/global";

export interface ArgValueProps {
  item: any;
  keyName?: string|number;
  expanded?: boolean;
  onClick?: (keyName:string|number) => void
}

export const getConsoleItemInfo = (item:any):ItemInfo => {
  const itemType = typeof(item);
  return {type: itemType, isRecursive: itemType === "object"};
}

const ClickableKeyObjectItem:React.FC<ArgValueProps> = ({item, keyName, expanded, onClick:propOnClick}) => {
  return (
      <div className="arg-object-title" onClick={(e) => {
        if (keyName && propOnClick) {
          propOnClick(keyName)
        }
      }}>
        {keyName && <span>{keyName}</span>}
        <i className={"fas" +  (expanded ? " fa-caret-down" : " fa-caret-right")} />
      </div>
  );
};


const DoubleQuotedDivItem:React.FC<ArgValueProps> = ({item, keyName}) => {
  return (
      <div>
        {keyName && <span>{keyName}:</span>}
        "{item}"
      </div>
  );
}

const DivItem:React.FC<ArgValueProps> = ({item,keyName}) => {
  return (
      <div>
        {keyName && <span>{keyName}:</span>}
        {item}
      </div>
  );
}

export const argArrayComponentMap:{[k:string]:React.FC<ArgValueProps>} = {
  "object": ClickableKeyObjectItem,
  "string": DoubleQuotedDivItem,
  "default": DivItem,
}

export type ItemInfo = {type:string, isRecursive:boolean};
export type GetItemInfoFunc = (item:any) => ItemInfo;

interface ArgItemProps {
  item: any;
  keyName?: number|string;
  showKeyName?: boolean;
  expanded?: boolean;
  onClick?: (keyName:number|string) => void;
  itemType: string;
  componentMap: {[k:string]:React.FC<ArgValueProps>}
}


const ArgItem:React.FC<ArgItemProps> = ({
                                      item,
                                      keyName,
                                      expanded=false,
                                      onClick,
                                      itemType,
                                      componentMap
                                    }) => {
  useEffect(() => {
    if (debugComponent) {
      console.log(`componentMap:`, componentMap);
    }
  }, [componentMap]);


  // let itemType:string = getItemTypeFunc(item).type;

  if (!Object.keys(componentMap).includes(itemType)) {
    itemType = "default";
  }

  // https://stackoverflow.com/questions/29875869/react-jsx-dynamic-component-name
  // React createElement expects string or a React class as first element
  return React.createElement(componentMap[itemType], {item, keyName, expanded, onClick}, null);
}

export default ArgItem;