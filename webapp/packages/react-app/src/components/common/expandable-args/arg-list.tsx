import React,{useState} from 'react';
import "./arg-list.css";
import {ClickableKeyObjectItem, DivItem, DoubleQuotedDivItem} from "./default-item-components";
import ExpandableSpan, {
  KeyValueHOComponent,
  KeyValueRepresentationComponentProps,
  ItemInfo,
  ObjectTraversalFunc, ArrayTraversalFunc
} from "./espan";

export type StringComponentMap = {[k:string]:React.FC<KeyValueRepresentationComponentProps>};

export const consoleComponentMap:StringComponentMap = {
  "object": ClickableKeyObjectItem,
  "string": DoubleQuotedDivItem,
  "default": DivItem,
}


export const getConsoleItemInfo = (value:any):ItemInfo => {
  const _itemType = typeof (value);
  const _isArray = _itemType === "object" && value.length !== undefined;
  const itemInfo:ItemInfo = {
    type: _itemType,
    isRecursive: _itemType === "object",
    component: consoleComponentMap[_itemType] || consoleComponentMap["default"],
    isArray: _isArray,
    traversalFunc: _itemType === "object" ? (_isArray) ? ArrayTraversalFunc : ObjectTraversalFunc : null,
  };

  return itemInfo;
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
      <div className="array-horizontal-box">
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
              {(itemInfo.isRecursive && itemInfo.traversalFunc) &&
                  <ExpandableSpan
                      objectOrArray={value}
                      isArray={itemInfo.isArray}
                      level={0}
                      expanded={childrenExpandedMap[index]}
                      getItemInfoFunc={getConsoleItemInfo}
                      traversalFunc={itemInfo.traversalFunc}
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