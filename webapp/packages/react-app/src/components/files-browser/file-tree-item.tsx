import {
  GetItemInfoFunc,
  ItemInfo, KeyValueRepresentationComponentProps,
  TraversalFunc
} from "../common/expandable-args/expandable-span-item";
import {FileNode} from "./file-node";
import React from "react";
import './file-tree-item.css';


// The main purpose of this file is to pass back getFileTreeItemInfo function
//


const fileNodeTraversalFunc:TraversalFunc = (fileNode:FileNode) => {
  if (fileNode && fileNode.childFileNodes) {
    return fileNode.childFileNodes.map((node, index) => {
      return [index, node];
    })
  }
  return [];
}

const ClickableFolderItem:React.FC<KeyValueRepresentationComponentProps> = (
    {itemInfo, keyName, parentType, expanded, onClick:propOnClick}
) => {
  // console.log(`ClickableFolderItem:`,value, keyName);
  return (
      <div className="folder-item" onClick={(e) => {
        if (keyName !== undefined && keyName !== null && propOnClick) {
          propOnClick(keyName)
        }
      }}>
        <i className={"fas" +  (expanded ? " fa-folder-open" : " fa-folder")} />
        <span>{itemInfo.value.info.name}</span>
      </div>
  );
};

const SimpleFileItem:React.FC<KeyValueRepresentationComponentProps> = (
    {itemInfo, keyName, parentType, expanded, onClick:propOnClick}
) => {
  // console.log(`SimpleFileItem:`,value, keyName);
  return (
      <div className="file-item">
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
    component: fileNode.info.type === "folder" ? ClickableFolderItem : SimpleFileItem,
  };
}