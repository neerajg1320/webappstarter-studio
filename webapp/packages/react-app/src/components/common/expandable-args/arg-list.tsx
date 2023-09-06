import React,{useState} from 'react';
import "./arg-list.css";
import {ClickableKeyObjectItem, DivItem, DoubleQuotedDivItem} from "./item-components";
import ExpandableSpan, {KeyValueHOComponent, KeyValueRepresentationComponentProps, ItemInfo} from "./espan";

export type StringComponentMap = {[k:string]:React.FC<KeyValueRepresentationComponentProps>};

export const consoleComponentMap:StringComponentMap = {
  "object": ClickableKeyObjectItem,
  "string": DoubleQuotedDivItem,
  "default": DivItem,
}

export const getConsoleItemInfo = (value:any):ItemInfo => {
  const itemType = typeof(value);
  let component = consoleComponentMap["default"];
  if (Object.keys(consoleComponentMap).includes(itemType)) {
    component = consoleComponentMap[itemType]
  }
  return {type: itemType, isRecursive: itemType === "object", component};
}


interface ArgListProps {
  list: any[];  
}


const ArgList:React.FC<ArgListProps> = ({list}) => {
  const [childrenExpandedMap, setChildrenExpandedMap] = useState<{[k:string]:boolean}>({});

  const handleArgClick = (k:number|string) => {
    setChildrenExpandedMap((prev) => {
      return {...prev, [k]: !prev[k]};
    });
  }

  return (
    <div className="args-wrapper">
      {/*<pre>{JSON.stringify(childrenExpandedMap, null, 2)}</pre>*/}
      <div className="args-box">
      {(list && list.length > 0) &&
        list.map((value:any, index:number) => {
          const itemInfo = getConsoleItemInfo(value);

          return (
            <div key={index}>
              <KeyValueHOComponent value={value}
                                   keyName={typeof(value) === "object" ? index : undefined}
                                   expanded={childrenExpandedMap[index]}
                                   onClick={handleArgClick}
                                   component={itemInfo.component}
              />
              {itemInfo.isRecursive &&
                  <ExpandableSpan
                      obj={value}
                      level={0}
                      expanded={childrenExpandedMap[index]}
                      getItemInfoFunc={getConsoleItemInfo}
                  />
              }
            </div>
          );
        })
      }
      </div>
    </div>
  );
}

export default ArgList;