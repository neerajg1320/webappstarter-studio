import React from "react";
import {KeyValueRepresentationComponentProps} from "./espan";
import './default-item-components.css';


export const ClickableKeyCurlyBracketsObjectItem:React.FC<KeyValueRepresentationComponentProps> = (
    {value, keyName, expanded, onClick:propOnClick}
) => {
  // console.log(`ClickableKeyCurlyBracketsObjectItem:`,value, keyName);
  return (
      <div className="arg-object-title" onClick={(e) => {
        if (keyName !== undefined && propOnClick) {
          propOnClick(keyName)
        }
      }}>
        {keyName !== undefined && <span>{keyName}{"{}"}</span>}
        <i className={"fas" +  (expanded ? " fa-caret-down" : " fa-caret-right")} />
      </div>
  );
};

export const ClickableKeyArrayItem:React.FC<KeyValueRepresentationComponentProps> = (
    {value, keyName, expanded, onClick:propOnClick}
) => {
  // console.log(`ClickableKeyArrayItem:`,value, keyName);
  return (
      <div className="arg-object-title" onClick={(e) => {
        if (keyName !== undefined && propOnClick) {
          propOnClick(keyName)
        }
      }}>
        {keyName !== undefined && <span>{keyName}</span>}
        <i className={"fas" +  (expanded ? " fa-caret-down" : " fa-caret-right")} />
      </div>
  );
};

export const ClickableKeySquareBracketsArrayItem:React.FC<KeyValueRepresentationComponentProps> = (
    {value, keyName, expanded, onClick:propOnClick}
) => {
  // console.log(`ClickableKeyArrayItem:`,value, keyName);
  return (
      <div className="arg-object-title" onClick={(e) => {
        if (keyName !== undefined && propOnClick) {
          propOnClick(keyName)
        }
      }}>
        {keyName !== undefined && <span>{keyName}[]</span>}
        <i className={"fas" +  (expanded ? " fa-caret-down" : " fa-caret-right")} />
      </div>
  );
};

export const DoubleQuotedDivItem:React.FC<KeyValueRepresentationComponentProps> = (
    {value, keyName}
) => {
  return (
      <div>
        {keyName !== undefined && <span>{keyName}:</span>}
        "{value}"
      </div>
  );
}

export const DivItem:React.FC<KeyValueRepresentationComponentProps> = (
    {value,keyName}
) => {
  return (
      <div>
        {keyName != undefined && <span>{keyName}:</span>}
        {value}
      </div>
  );
}