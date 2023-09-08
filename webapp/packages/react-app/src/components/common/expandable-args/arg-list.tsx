import React, {useMemo} from 'react';
import "./arg-list.css";
import {
  ClickableKeyCurlyBracketsObjectItem,
  ClickableKeySquareBracketsArrayItem,
  DivItem,
  DoubleQuotedDivItem
} from "./basic-components";
import {
  KeyValueRepresentationComponentProps,
  ItemInfo,
  ObjectTraversalFunc, ArrayTraversalFunc
} from "./component-tree-item";
import ComponentTree from "./component-tree";


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
    value,
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
  const listInfo = useMemo(() => {
    return getConsoleItemInfo(list)
  }, [list]);

  return (
    <div>
      {/*<pre>{JSON.stringify(childrenExpandedMap, null, 2)}</pre>*/}
      <div>
      {(list && list.length > 0) &&
          <>
          {listInfo.traversalFunc ?
              <ComponentTree
                  treeName="ConsoleLog"
                  itemInfo={listInfo}
                  keyName={'root-array'}
                  parentInfo={null}
                  expanded={true}
                  level={0}
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