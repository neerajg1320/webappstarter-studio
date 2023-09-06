import React from 'react';
import "./arg-list.css";
import {
  ClickableKeyCurlyBracketsObjectItem,
  ClickableKeySquareBracketsArrayItem,
  DivItem,
  DoubleQuotedDivItem
} from "./default-item-components";
import ExpandableSpan, {
  KeyValueRepresentationComponentProps,
  ItemInfo,
  ObjectTraversalFunc, ArrayTraversalFunc
} from "./espan";


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
  let _traversalFunc = null;
  let _enclosingClass = null;

  if (_isRecursive) {
    if (value.length !== undefined) {
      _itemType = "array";
      _traversalFunc = ArrayTraversalFunc;
      _enclosingClass = "array-box";
    } else {
      _traversalFunc = ObjectTraversalFunc;
      _enclosingClass = "object-box";
    }
  }

  return {
    type: _itemType,
    isRecursive: _isRecursive,
    traversalFunc: _traversalFunc,
    enclosingClass: _enclosingClass,
    component: consoleComponentMap[_itemType] || consoleComponentMap["default"],
  };
}


interface ArgListProps {
  list: any[];  
}


const ArgList:React.FC<ArgListProps> = ({list}) => {
  const listInfo = getConsoleItemInfo(list);

  return (
    <div className="args-wrapper">
      {/*<pre>{JSON.stringify(childrenExpandedMap, null, 2)}</pre>*/}
      <div className="array-horizontal-box">
      {(list && list.length > 0) &&
          <>
          {listInfo.traversalFunc ?
                <ExpandableSpan expandableValue={list}
                                type={listInfo.type}
                                traversalFunc={listInfo.traversalFunc}
                                enclosingClass={listInfo.enclosingClass}
                                level={0}
                                expanded={true}
                                getItemInfoFunc={getConsoleItemInfo}
                />
                :
                <div>List can't be traversed</div>
          }
          </>
      }
      </div>
    </div>
  );
}

export default ArgList;