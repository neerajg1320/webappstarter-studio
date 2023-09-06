import React from "react";
import './arg-item.css';


export interface ArgValueProps {
  item: any;
  keyName?: string|number;
  expanded?: boolean;
  onClick?: (keyName:string|number) => void
}

export type ItemInfo = {type:string, isRecursive:boolean, component:React.FC<ArgValueProps>};
export type GetItemInfoFunc = (item:any) => ItemInfo;
export type StringComponentMap = {[k:string]:React.FC<ArgValueProps>};

export const ClickableKeyObjectItem:React.FC<ArgValueProps> = ({item, keyName, expanded, onClick:propOnClick}) => {
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


export const DoubleQuotedDivItem:React.FC<ArgValueProps> = ({item, keyName}) => {
  return (
      <div>
        {keyName && <span>{keyName}:</span>}
        "{item}"
      </div>
  );
}

export const DivItem:React.FC<ArgValueProps> = ({item,keyName}) => {
  return (
      <div>
        {keyName && <span>{keyName}:</span>}
        {item}
      </div>
  );
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