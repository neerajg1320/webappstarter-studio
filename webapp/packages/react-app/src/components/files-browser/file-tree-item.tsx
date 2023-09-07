import {
  GetItemInfoFunc,
  ItemInfo, KeyValueRepresentationComponentProps,
  TraversalFunc
} from "../common/expandable-args/expandable-span-item";
import {FileNode, safeFileNodeTraveral} from "./file-node";
import React from "react";
import './file-tree-item.css';
import {debugComponent} from "../../config/global";


// The main purpose of this file is to pass back getFileTreeItemInfo function
//

const fileNodeTraversalFunc:TraversalFunc = (fileNode:FileNode) => {
  if (fileNode && fileNode.childrenFileNodeMap) {
    return Object.entries(fileNode.childrenFileNodeMap)
  }
  return [];
}


const ClickableFolderItem:React.FC<KeyValueRepresentationComponentProps> = (
    {itemInfo, keyName, parentType, expanded, onClick:propOnClick}
) => {
  const handleFolderClick = (e:React.MouseEvent) => {
    if (keyName !== undefined && keyName !== null && propOnClick) {
      propOnClick(keyName)
      if (debugComponent) {
        const fileNode:FileNode = itemInfo.value;
        console.log(`ClickableFolderItem:handleFolderClick() itemInfo:${JSON.stringify(fileNode, safeFileNodeTraveral, 2)}`)
      }
    }
  }

  return (
      <div className="folder-item" onClick={handleFolderClick}>
        <i className={"fas" +  (expanded ? " fa-folder-open" : " fa-folder")} />
        <span>{itemInfo.value.info.name}</span>
      </div>
  );
};

const ClickableFileItem:React.FC<KeyValueRepresentationComponentProps> = (
    {itemInfo, keyName, parentType, expanded, onClick:propOnClick}
) => {
  const handleFileClick = (e:React.MouseEvent) => {
    if (keyName !== undefined && keyName !== null && propOnClick) {
      propOnClick(keyName)
      if (debugComponent) {
        const fileNode:FileNode = itemInfo.value;
        console.log(`ClickableFolderItem:handleFolderClick() itemInfo:${JSON.stringify(fileNode, safeFileNodeTraveral, 2)}`)
      }
    }
  }

  return (
      <div className="file-item" onClick={handleFileClick}>
        <i className="fas fa-file" />
        <span>{itemInfo.value.info.name}</span>
      </div>
  );
};

export const getFileTreeItemInfo:GetItemInfoFunc = (fileNode:FileNode):ItemInfo => {

  return {
    value:fileNode,
    type: fileNode.info.type,
    isRecursive: fileNode.info.type === "folder",
    traversalFunc: fileNodeTraversalFunc,
    enclosingClass: "file-tree",
    component: fileNode.info.type === "folder" ? ClickableFolderItem : ClickableFileItem,
  };
}