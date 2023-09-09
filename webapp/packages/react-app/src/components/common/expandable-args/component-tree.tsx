import React, {useState} from 'react';
import './component-tree.css';
import {debugComponent} from "../../../config/global";
import {
  GetItemInfoFunc, ItemDataType, ItemEventDataType,
  ItemEventType,
  ItemInfoType,
  ItemKeyType,
  KeyValueRepresentationComponentProps
} from "./component-tree-item";


export interface KeyValueHOComponentProps extends KeyValueRepresentationComponentProps {
  component: React.FC<KeyValueRepresentationComponentProps>;
}

export const KeyValueHOComponent:React.FC<KeyValueHOComponentProps> = ({
                                                                         treeName,
                                                                         itemInfo,
                                                                         keyName,
                                                                         parentInfo,
                                                                         expanded=false,
                                                                         level,
                                                                         onClick,
                                                                         onEvent,
                                                                         component
                                                                       }) => {
  return React.createElement(
      component,
      {treeName, itemInfo, keyName, parentInfo, expanded, level, onClick, onEvent},
      null
  );
}


interface ExpandableSpanProps extends KeyValueRepresentationComponentProps {
  getItemInfoFunc: GetItemInfoFunc;
};


const ComponentTree:React.FC<ExpandableSpanProps> = ({
                                                       treeName,
                                                       itemInfo,
                                                       keyName=null,
                                                       parentInfo,
                                                       expanded: initialExpanded=false,
                                                       level,
                                                       onClick:propOnClick,
                                                       onEvent:propOnEvent,
                                                       getItemInfoFunc,
                                                     }) => {
  const [expanded, setExpanded] = useState<boolean>(initialExpanded);

  if (level === 0) {
    if (debugComponent) {
      if (treeName === "FileBrowser") {
        console.log(`ComponentTree[${treeName}]:render itemInfo:`, itemInfo);
      }
    }
  }

  const handleHOComponentClick = (k: ItemKeyType, i:ItemInfoType) => {
    setExpanded((prev) => !prev);

    if (propOnClick) {
      // propOnClick(keyName, itemInfo)
      propOnClick(k, i)
    }
  }

  const handleHOComponentEvent = (type:ItemEventType, data:ItemEventDataType) => {
    console.log(`ComponentTree:onEvent() type:${type} data:`, data);
    if (propOnEvent) {
      propOnEvent(type, data);
    }
  }

  return (
    <div className={"object-wrapper" + ((level === 0) ? " root" : " intermediate")}>
      {/* The Representation of the Compoenent */}
      <KeyValueHOComponent
          treeName={treeName}
          itemInfo={itemInfo}
          keyName={keyName}
          parentInfo={parentInfo}
          expanded={expanded}
          level={level}
          onClick={(k, i) => handleHOComponentClick(k, i)}
          onEvent={(type, data) => handleHOComponentEvent(type, data)}
          component={itemInfo.component}
      />

      {/* We traverse the item if it has a traversalFunc and the state is expanded */}
      <div className={`${itemInfo.enclosingClass||''}`}>
      {(expanded && itemInfo.traversalFunc) &&
        itemInfo.traversalFunc(itemInfo.value).map(([k, v], index:number) => {
            const childItemInfo = getItemInfoFunc(v)
            if (debugComponent) {
              console.log(`k:${k} v:${v} type:${itemInfo.type} itemInfo(v)`, childItemInfo);
            }

            return (
                <div key={index} >
                  <ComponentTree
                      treeName={treeName}
                      itemInfo={childItemInfo}
                      keyName={k}
                      parentInfo={itemInfo}
                      expanded={false}
                      level={level + 1}
                      onClick={propOnClick}
                      onEvent={propOnEvent}
                      {...{getItemInfoFunc}}
                  />
                </div>
            );
        })
      }
      </div>
    </div>
  );
};

export default ComponentTree;