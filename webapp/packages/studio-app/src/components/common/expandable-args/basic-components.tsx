import React from "react";
import {KeyValueRepresentationComponentProps} from "./component-tree-item";
import './basic-components.css';


export const ClickableKeyCurlyBracketsObjectItem:React.FC<KeyValueRepresentationComponentProps> = (
    {itemNode, keyName, parentInfo, expanded, onClick:propOnClick, getItemInfoFunc}
) => {
  const itemInfo = getItemInfoFunc(itemNode);

  const handleObjectClick = (e:React.MouseEvent) => {
    if (keyName !== undefined && keyName !== null && propOnClick) {
      propOnClick(keyName, itemInfo)
    }
  }

  return (
      <div className="arg-object-title" onClick={handleObjectClick}>
        {parentInfo && parentInfo.type !== "array" && <span>{keyName}</span>}
        <span>{"{}"}</span>
        <i className={"fas" +  (expanded ? " fa-caret-down" : " fa-caret-right")} />
      </div>
  );
};


// Show only non-root components. For root component parentInfo is null
// For root component the class becomes 'arg-object-title-none' otherwise it is 'arg-object-title'
export const ClickableKeySquareBracketsArrayItem:React.FC<KeyValueRepresentationComponentProps> = (
    {itemNode, keyName, parentInfo, expanded, onClick:propOnClick, getItemInfoFunc}
) => {
  const itemInfo = getItemInfoFunc(itemNode);

  const handleArrayClick = (e:React.MouseEvent) => {
    if (keyName !== undefined && keyName !== null && propOnClick) {
      propOnClick(keyName, itemInfo)
    }
  }

  return (
      <div className={`arg-object-title${parentInfo === null ? "-none" : ""}`} onClick={handleArrayClick}>
        {parentInfo && parentInfo.type !== "array" && <span>{keyName}</span>}
        <span>[]</span>
        <i className={"fas" + (expanded ? " fa-caret-down" : " fa-caret-right")}/>
      </div>
  );
};

export const DoubleQuotedDivItem:React.FC<KeyValueRepresentationComponentProps> = (
    {itemNode, keyName, parentInfo, getItemInfoFunc}
) => {
  const itemInfo = getItemInfoFunc(itemNode);

  return (
      <div>
        {parentInfo && parentInfo.type !== "array"  && <span>{keyName}:</span>}
        "{itemInfo.value}"
      </div>
  );
}

export const DivItem:React.FC<KeyValueRepresentationComponentProps> = (
    {itemNode,keyName, parentInfo, getItemInfoFunc}
) => {
  const itemInfo = getItemInfoFunc(itemNode);

  return (
      <div>
        {parentInfo && parentInfo.type !== "array"  && <span>{keyName}:</span>}
        {itemInfo.value}
      </div>
  );
}