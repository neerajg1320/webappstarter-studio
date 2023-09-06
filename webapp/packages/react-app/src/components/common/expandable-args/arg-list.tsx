import React,{useState} from 'react';
import "./arg-list.css";
import {
  ClickableKeyArrayItem,
  ClickableKeyCurlyBracketsObjectItem,
  ClickableKeySquareBracketsArrayItem,
  DivItem,
  DoubleQuotedDivItem
} from "./default-item-components";
import ExpandableSpan, {
  KeyValueHOComponent,
  KeyValueRepresentationComponentProps,
  ItemInfo,
  ObjectTraversalFunc, ArrayTraversalFunc
} from "./espan";

// export type ItemType =  "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function" ;

export type StringComponentMap = {[k:string]:React.FC<KeyValueRepresentationComponentProps>};

export const consoleComponentMap:StringComponentMap = {
  "object": ClickableKeyCurlyBracketsObjectItem,
  "array": ClickableKeySquareBracketsArrayItem,
  "string": DoubleQuotedDivItem,
  "default": DivItem,
}


export const getConsoleItemInfo = (value:any):ItemInfo => {
  let _itemType:string = typeof (value);
  let _isRecursive = _itemType === "object";
  const _isArray = _itemType === "object" && value.length !== undefined;

  if (_isArray) {
    _itemType = "array";
  }

  let _traversalFunc = null;
  if (_isRecursive) {
    if (_isArray) {
      _traversalFunc = ArrayTraversalFunc;
    } else {
      _traversalFunc = ObjectTraversalFunc;
    }
  }

  const itemInfo:ItemInfo = {
    type: _itemType,
    isRecursive: _itemType === "object" || _itemType === "array",
    isArray: _isArray,
    traversalFunc: _traversalFunc,
    component: consoleComponentMap[_itemType] || consoleComponentMap["default"],
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
                                   parentType={"array"}
                                   expanded={childrenExpandedMap[index]}
                                   onClick={handleArgClick}
                                   component={itemInfo.component}
              />
              {(itemInfo.isRecursive && itemInfo.traversalFunc) &&
                  <ExpandableSpan
                      objectOrArray={value}
                      isArray={itemInfo.isArray}
                      type="array"
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