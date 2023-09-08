import {
  GetItemInfoFunc,
  ItemInfo, KeyValueRepresentationComponentProps,
  TraversalFunc
} from "../common/expandable-args/component-tree-item";
import {FileReduxNode, safeFileNodeTraveral} from "./file-redux-node";
import React from "react";
import './file-browser-redux-tree-item.css';
import {debugComponent} from "../../config/global";


// The main purpose of this file is to pass back getFileTreeItemInfo function
//

const fileNodeTraversalFunc:TraversalFunc = (fileNode:FileReduxNode) => {
  if (fileNode && fileNode.childrenFileNodeMap) {
    return Object.entries(fileNode.childrenFileNodeMap)
  }
  return [];
}


const ClickableFolderItem:React.FC<KeyValueRepresentationComponentProps> = (
    {itemInfo, keyName, parentInfo, expanded, level, onClick:propOnClick}
) => {
  const handleFolderClick = (e:React.MouseEvent) => {
    if (propOnClick) {
      propOnClick(keyName, itemInfo);
    }
  }

  return (
      <div className="file-item" onClick={handleFolderClick}>
        <i className={"fas" +  (expanded ? " fa-folder-open" : " fa-folder")} />
        <span>{itemInfo.value.info.name}</span>
      </div>
  );
};

const ClickableFileItem:React.FC<KeyValueRepresentationComponentProps> = (
    {itemInfo, keyName, parentInfo, expanded,level, onClick:propOnClick}
) => {
  const reduxFile = itemInfo.value.info.reduxFile;

  const handleFileClick = (e:React.MouseEvent) => {
    if (propOnClick) {
      propOnClick(keyName, itemInfo);
    }
  }

  return (
      <div className={"file-item" + ((reduxFile && reduxFile.isSelected) ? " selected" : "")} onClick={handleFileClick}>
        {/*{(reduxFile && reduxFile.isSelected) && <i className="fas fa-file-archive" />}*/}
        <i className="fas fa-file" />
        <span>{itemInfo.value.info.name}</span>
      </div>
  );
};

export const getFileTreeItemInfo:GetItemInfoFunc = (fileNode:FileReduxNode):ItemInfo => {

  return {
    value:fileNode,
    type: fileNode.info.type,
    isRecursive: fileNode.info.type === "folder",
    traversalFunc: fileNodeTraversalFunc,
    enclosingClass: "file-tree",
    component: fileNode.info.type === "folder" ? ClickableFolderItem : ClickableFileItem,
  };
}