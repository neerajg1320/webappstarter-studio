import {
  GetItemInfoFunc,
  ItemInfoType, KeyValueRepresentationComponentProps,
  TraversalFunc
} from "../common/expandable-args/component-tree-item";
import {FileReduxNode, safeFileNodeTraveral} from "./file-redux-node";
import React, {useState} from "react";
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
                                                                            itemInfo,
                                                                            keyName,
                                                                            parentInfo,
                                                                            expanded,
                                                                            level,
                                                                            onClick:propOnClick,
                                                                            onEvent:propOnEvent
}) => {
  const reduxFile = itemInfo.value.info.reduxFile;
  const isFolder = itemInfo.value.info.type === "folder";

  const handleFileClick = (e:React.MouseEvent) => {
    // console.log(`handleFileClick`);
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

  return (
      <div className={"file-item " + ((reduxFile && reduxFile.isSelected) ? " selected" : "")}
           onClick={handleFileClick}
      >
        {isFolder ?
            <i className={"fas" +  (expanded ? " fa-folder-open" : " fa-folder")} />
            :
            <i className="fas fa-file" />
        }
        <EditableSpan value={itemInfo.value.info.name} onChange={handleOnChange}/>
      </div>
  );
};

export const getFileTreeItemInfo:GetItemInfoFunc = (fileNode:FileReduxNode):ItemInfoType => {

  return {
    value:fileNode,
    type: fileNode.info.type,
    isRecursive: fileNode.info.type === "folder",
    traversalFunc: fileNodeTraversalFunc,
    enclosingClass: "file-tree",
    component: ClickableFileItem,
  };
}