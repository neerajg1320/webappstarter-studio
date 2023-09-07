import React from "react";
import {KeyValueRepresentationComponentProps} from "./expandable-span-item";
import './default-item-components.css';


export const ClickableKeyCurlyBracketsObjectItem:React.FC<KeyValueRepresentationComponentProps> = (
    {itemInfo, keyName, parentType, expanded, onClick:propOnClick}
) => {
  const handleObjectClick = (e:React.MouseEvent) => {
    if (keyName !== undefined && keyName !== null && propOnClick) {
      propOnClick(keyName)
    }
  }

  return (
      <div className="arg-object-title" onClick={handleObjectClick}>
        {parentType !== "array" && <span>{keyName}</span>}
        <span>{"{}"}</span>
        <i className={"fas" +  (expanded ? " fa-caret-down" : " fa-caret-right")} />
      </div>
  );
};


// Show only non-root components. For root component parentType is null
// For root component the class becomes 'arg-object-title-none' otherwise it is 'arg-object-title'
export const ClickableKeySquareBracketsArrayItem:React.FC<KeyValueRepresentationComponentProps> = (
    {itemInfo, keyName, parentType, expanded, onClick:propOnClick}
) => {
  const handleArrayClick = (e:React.MouseEvent) => {
    if (keyName !== undefined && keyName !== null && propOnClick) {
      propOnClick(keyName)
    }
  }

  return (
      <div className={`arg-object-title${parentType === null ? "-none" : ""}`} onClick={handleArrayClick}>
        {parentType !== "array" && <span>{keyName}</span>}
        <span>[]</span>
        <i className={"fas" + (expanded ? " fa-caret-down" : " fa-caret-right")}/>
      </div>
  );
};

export const DoubleQuotedDivItem:React.FC<KeyValueRepresentationComponentProps> = (
    {itemInfo, keyName, parentType}
) => {
  return (
      <div>
        {parentType !== "array" && <span>{keyName}:</span>}
        "{itemInfo.value}"
      </div>
  );
}

export const DivItem:React.FC<KeyValueRepresentationComponentProps> = (
    {itemInfo,keyName, parentType}
) => {
  return (
      <div>
        {parentType !== "array" && <span>{keyName}:</span>}
        {itemInfo.value}
      </div>
  );
}