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

export type ItemInfo = {type:string, isRecursive:boolean};
export type GetItemInfoFunc = (item:any) => ItemInfo;
export type StringComponentMap = {[k:string]:React.FC<ArgValueProps>};
export const argArrayComponentMap:{[k:string]:React.FC<ArgValueProps>} = {
  "object": ClickableKeyObjectItem,
  "string": DoubleQuotedDivItem,
  "default": DivItem,
}

export const getItemInfo = (item:any, getItemInfoFunc:GetItemInfoFunc, componentMap:StringComponentMap):ItemInfo => {
  let _itemInfo = getItemInfoFunc(item);

  if (!Object.keys(componentMap).includes(_itemInfo.type)) {
    _itemInfo = {type: "default", isRecursive:false}
  }

  return _itemInfo;
}

interface ArgItemProps {
  item: any;
  keyName?: number|string;
  showKeyName?: boolean;
  expanded?: boolean;
  onClick?: (keyName:number|string) => void;
  component: React.FC<ArgValueProps>;
}


const ArgItem:React.FC<ArgItemProps> = ({
                                          item,
                                          keyName,
                                          expanded=false,
                                          onClick,
                                          component
                                        }) => {

  return React.createElement(component, {item, keyName, expanded, onClick}, null);
}

export default ArgItem;