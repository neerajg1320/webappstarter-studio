import {
  GetItemInfoFunc,
  ItemInfoType, KeyValueRepresentationComponentProps,
  TraversalFunc
} from "../common/expandable-args/component-tree-item";
import {FileReduxNode} from "./file-redux-node";
import React, {useEffect, useMemo, useRef, useState} from "react";
import './file-browser-redux-tree-item.css';
import EditableSpan from "../common/editable-span";


// The main purpose of this file is to pass back getFileTreeItemInfo function
//

const fileNodeTraversalFunc:TraversalFunc = (fileNode:FileReduxNode) => {
  if (fileNode && fileNode.childrenFileNodeMap) {
    return Object.entries(fileNode.childrenFileNodeMap)
  }
  return [];
}


const ClickableFileItem:React.FC<KeyValueRepresentationComponentProps> = ({
                                                                            itemNode,
                                                                            keyName,
                                                                            parentInfo,
                                                                            expanded,
                                                                            level,
                                                                            onClick:propOnClick,
                                                                            onEvent:propOnEvent,
                                                                            getItemInfoFunc,
                                                                            draggable:propDraggable,
                                                                            onDragStart,
                                                                            onDragOver,
                                                                            onDragLeave,
                                                                            onDrop,
                                                                            renderCount,
}) => {
  const itemInfo = getItemInfoFunc(itemNode);

  const reduxFile = itemInfo.value.info.reduxFile;
  const isFolder = itemInfo.value.info.type === "folder";


  const draggable = useMemo(() => {
    if (propDraggable) {
      return itemInfo.value.info.type === "file";
    }
    return false;
  }, [itemInfo]);

  const handleFileClick = (e:React.MouseEvent) => {
    if (propOnClick) {
      propOnClick(keyName, itemInfo);
    }
  }

  const [fileName, setFileName] = useState(itemNode.info.name);
  // const name = itemInfo.value.info.name;
  // const name = itemNode.info.name;
  // const fileNameRef = useRef<string>(name);

  useEffect(() => {
    setFileName(itemNode.info.name);
  }, [itemNode.info.name]);

  const handleOnChange = (value:string) => {
    console.log(`handleOnChange(): value=${value}`);
    setFileName(value);
  }

  const handleFileNameBlur = () => {
    if (propOnEvent) {
      console.log(`handleOnChange(): value=${fileName} and event`);
      propOnEvent("change", {keyName, itemInfo, value:fileName});
    }
  }

  const handleModeChange = () => {

  }


  const handleDragStart = (e:React.MouseEvent) => {
    if (onDragStart) {
      onDragStart(itemInfo);
    }
  }

  const handleDragOver = (e:React.MouseEvent) => {
    // This is necessary here for onDrop event to happen
    e.preventDefault();

    if (onDragOver) {
      onDragOver(itemInfo);
    }
  }

  const handleDragLeave = (e:React.MouseEvent) => {
    // console.log(`ClickableFileItem: handleDragLeave()`);
    if (onDragLeave) {
      onDragLeave(itemInfo);
    }
  }

  const handleDrop = (e:React.MouseEvent) => {
    // console.log(`onDrop(): `, itemInfo);
    if (onDrop) {
      onDrop(itemInfo);
    }
  }

  return (
      <div
          className={"file-item " + ((reduxFile && reduxFile.isSelected) ? " selected" : "")}
          onClick={handleFileClick}
          draggable={draggable}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
      >
        {isFolder ?
            <i className={"fas" +  (expanded ? " fa-folder-open" : " fa-folder")} />
            :
            <i className="fas fa-file" />
        }
        {renderCount !== undefined && <span>{`[${renderCount}]`}</span>}
        <span>{itemNode.info.name}</span>
        <EditableSpan
            value={fileName}
            onChange={handleOnChange}
            opts={{blurOnEnterPressOnly:false}}
            mode={reduxFile && reduxFile.isPathEditing}
            onModeChange={handleModeChange}
            onBlur={handleFileNameBlur}
        />
      </div>
  );
};

export const getFileTreeItemInfo:GetItemInfoFunc = (fileNode:FileReduxNode):ItemInfoType => {
  return {
    value:fileNode,
    type: fileNode.info.type,
    traversalFunc: fileNodeTraversalFunc,
    enclosingClass: "file-tree",
    component: ClickableFileItem,
  };
}