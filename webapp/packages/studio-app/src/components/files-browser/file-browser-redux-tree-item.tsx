import {
  GetItemInfoFunc,
  ItemInfoType, KeyValueRepresentationComponentProps,
  TraversalFunc
} from "../common/expandable-args/component-tree-item";
import {FileReduxNode} from "./file-redux-node";
import React from "react";
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
                                                                            draggable,
                                                                            onDragStart,
                                                                            onDragOver,
                                                                            onDrop,
}) => {
  const itemInfo = getItemInfoFunc(itemNode);

  const reduxFile = itemInfo.value.info.reduxFile;
  const isFolder = itemInfo.value.info.type === "folder";

  const handleFileClick = (e:React.MouseEvent) => {
    if (propOnClick) {
      propOnClick(keyName, itemInfo);
    }
  }

  const handleOnChange = (value:string) => {
    console.log(`handleOnChange(): value=${value}`);
    if (propOnEvent) {
      console.log(`handleOnChange(): value=${value} and event`);
      propOnEvent("change", {keyName, itemInfo, value});
    }
  }

  const handleModeChange = () => {

  }

  const name = itemInfo.value.info.name;

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
          onDrop={handleDrop}
      >
        {isFolder ?
            <i className={"fas" +  (expanded ? " fa-folder-open" : " fa-folder")} />
            :
            <i className="fas fa-file" />
        }
        <EditableSpan value={name} onChange={handleOnChange} opts={{blurOnEnterPressOnly:false}}
                      mode={reduxFile && reduxFile.isPathEditing} onModeChange={handleModeChange}
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