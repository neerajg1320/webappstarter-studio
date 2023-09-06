import React from "react";
import {LeafItemProps} from "./espan";
import './item-components.css';


export const ClickableKeyObjectItem:React.FC<LeafItemProps> = ({value, keyName, expanded, onClick:propOnClick}) => {
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


export const DoubleQuotedDivItem:React.FC<LeafItemProps> = ({value, keyName}) => {
  return (
      <div>
        {keyName && <span>{keyName}:</span>}
        "{value}"
      </div>
  );
}

export const DivItem:React.FC<LeafItemProps> = ({value,keyName}) => {
  return (
      <div>
        {keyName && <span>{keyName}:</span>}
        {value}
      </div>
  );
}