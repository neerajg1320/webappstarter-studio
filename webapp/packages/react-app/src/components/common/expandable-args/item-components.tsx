import React from "react";
import {LeftItemProps} from "./espan";
import './item-components.css';


export const ClickableKeyObjectItem:React.FC<LeftItemProps> = ({item, keyName, expanded, onClick:propOnClick}) => {
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


export const DoubleQuotedDivItem:React.FC<LeftItemProps> = ({item, keyName}) => {
  return (
      <div>
        {keyName && <span>{keyName}:</span>}
        "{item}"
      </div>
  );
}

export const DivItem:React.FC<LeftItemProps> = ({item,keyName}) => {
  return (
      <div>
        {keyName && <span>{keyName}:</span>}
        {item}
      </div>
  );
}