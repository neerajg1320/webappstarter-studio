import React from "react";
import {LeftItemProps} from "./espan";
import './item-components.css';


export const ClickableKeyObjectItem:React.FC<LeftItemProps> = ({value, keyName, expanded, onClick:propOnClick}) => {
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


export const DoubleQuotedDivItem:React.FC<LeftItemProps> = ({value, keyName}) => {
  return (
      <div>
        {keyName && <span>{keyName}:</span>}
        "{value}"
      </div>
  );
}

export const DivItem:React.FC<LeftItemProps> = ({value,keyName}) => {
  return (
      <div>
        {keyName && <span>{keyName}:</span>}
        {value}
      </div>
  );
}