import React, { useCallback, useState } from "react";
import "./component-tree.css";
import { debugComponent } from "../../../config/global";
import {
  DraggableComponent,
  ItemEventDataType,
  ItemEventType,
  ItemInfoType,
  ItemKeyType,
  KeyValueRepresentationComponentProps,
  ReactProps,
} from "./component-tree-item";
import useDifferentialCallback from "../../../hooks/use-differential-callback";

export interface KeyValueHOComponentProps
  extends KeyValueRepresentationComponentProps,
    DraggableComponent,
    ReactProps {
  component?: React.FC<KeyValueHOComponentProps>;
}

export const KeyValueHOComponent: React.FC<KeyValueHOComponentProps> = ({
  treeName,
  itemNode,
  keyName,
  parentInfo,
  expanded,
  level,
  onClick,
  onEvent,
  getItemInfoFunc,
  component,
  draggable,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  renderCount,
}) => {
  return React.createElement(
    component,
    {
      treeName,
      itemNode,
      keyName,
      parentInfo,
      expanded,
      level,
      onClick,
      onEvent,
      getItemInfoFunc,
      draggable,
      onDragStart,
      onDragOver,
      onDragLeave,
      onDrop,
      renderCount,
    },
    null
  );
};

interface ComponentTreeProps extends KeyValueHOComponentProps {
  intermediateExpanded: boolean;
}

const ComponentTree: React.FC<ComponentTreeProps> = ({
  treeName,
  itemNode,
  keyName = null,
  parentInfo,
  expanded: initialExpanded,
  intermediateExpanded,
  level,
  onClick: propOnClick,
  onEvent: propOnEvent,
  getItemInfoFunc,
  component,
  draggable,
  onDragStart,
  onDragOver,
  onDrop,
  renderCount,
}) => {
  const [expanded, setExpanded] = useState<boolean>(initialExpanded);

  // TBD: check if we can use useMemo here
  const itemInfo = getItemInfoFunc(itemNode);
  console.log("itemInfo: ", itemInfo);

  if (level < 5) {
    if (debugComponent) {
      if (treeName === "FileBrowser") {
        console.log(`ComponentTree[${treeName}]:render itemInfo:`, itemInfo);
      }
    }
  }

  const handleHOComponentClick = (k: ItemKeyType, i: ItemInfoType) => {
    setExpanded((prev) => !prev);

    if (propOnClick) {
      // propOnClick(keyName, itemInfo)
      propOnClick(k, i);
    }
  };

  const handleHOComponentEvent = (
    type: ItemEventType,
    data: ItemEventDataType
  ) => {
    // console.log(`ComponentTree:onEvent() type:${type} data:`, data);
    if (propOnEvent) {
      propOnEvent(type, data);
    }
  };

  const [isDraggedOver, setDraggedOver] = useState<boolean>(false);

  const showItemPath = useCallback(
    (paramItemInfo: ItemInfoType, title) => {},
    []
  );

  const handleDragOver = useDifferentialCallback(
    (paramItemInfo: ItemInfoType) => {
      if (debugComponent) {
        if (paramItemInfo.value.info.type === "file") {
          console.log(
            `handleDragOver(): filePath: '${paramItemInfo.value.info.reduxFile.path}'`
          );
        } else if (paramItemInfo.value.info.type === "folder") {
          const folderPath = paramItemInfo.value.info.rootNamePath.join("/");
          console.log(`handleDragOver(): folderPath: '${folderPath}'`);
        }
      }

      // We do not need to propagate this
      // if (onDragOver) {
      //   onDragOver(itemInfo);
      // }
    }
  );

  const handleDragLeave = useDifferentialCallback(
    (paramItemInfo: ItemInfoType) => {
      if (debugComponent) {
        if (paramItemInfo.value.info.type === "file") {
          console.log(
            `handleDragLeave(): filePath: '${paramItemInfo.value.info.reduxFile.path}'`
          );
        } else if (paramItemInfo.value.info.type === "folder") {
          const folderPath = paramItemInfo.value.info.rootNamePath.join("/");
          console.log(`handleDragLeave(): folderPath: '${folderPath}'`);
        }
      }
    }
  );

  return (
    <div
      className={
        "object-wrapper" +
        (level === 0 ? " root" : " intermediate") +
        (isDraggedOver ? " dragged-over" : "")
      }
    >
      {/* The Representation of the Component */}
      <KeyValueHOComponent
        treeName={treeName}
        itemNode={itemNode}
        keyName={keyName}
        parentInfo={parentInfo}
        expanded={expanded}
        level={level}
        onClick={(k, i) => handleHOComponentClick(k, i)}
        onEvent={(type, data) => handleHOComponentEvent(type, data)}
        {...{ getItemInfoFunc }}
        component={itemInfo.component}
        onDragOver={handleDragOver}
        // onDragLeave={handleDragLeave}
        {...{ draggable, onDragStart, onDrop }}
        {...{ renderCount }}
      />

      {/* We traverse the item if it has a traversalFunc and the state is expanded */}
      <div className={`${itemInfo.enclosingClass || ""}`}>
        {expanded &&
          itemInfo.traversalFunc &&
          itemInfo
            .traversalFunc(itemInfo.value)
            .map(([k, v], index: number) => {
              const childItemInfo = getItemInfoFunc(v);
              if (debugComponent) {
                console.log(
                  `k:${k} v:${v} type:${itemInfo.type} itemInfo(v)`,
                  childItemInfo
                );
              }

              return (
                <div key={index}>
                  <ComponentTree
                    treeName={treeName}
                    itemNode={v}
                    keyName={k}
                    parentInfo={itemInfo}
                    expanded={intermediateExpanded}
                    level={level + 1}
                    onClick={propOnClick}
                    onEvent={propOnEvent}
                    {...{ getItemInfoFunc }}
                    onDragOver={handleDragOver}
                    // onDragLeave={handleDragLeave}
                    {...{ draggable, onDragStart, onDrop }}
                    {...{ renderCount, intermediateExpanded }}
                  />
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default ComponentTree;
