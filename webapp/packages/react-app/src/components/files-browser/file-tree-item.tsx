import {
  GetItemInfoFunc,
  ItemInfo, KeyValueRepresentationComponentProps,
  TraversalFunc
} from "../common/expandable-args/expandable-span-item";
import {FileNode} from "./file-node";
import React from "react";


// The main purpose of this file is to pass back getFileTreeItemInfo function
//


const fileNodeTraversalFunc:TraversalFunc = (fileNode:FileNode) => {
  if (fileNode && fileNode.children) {
    return fileNode.children.map((node, index) => {
      return [index, node];
    })
  }
  return [];
}

const ClickableFolderItem:React.FC<KeyValueRepresentationComponentProps> = (
    {value:fileNode, keyName, parentType, expanded, onClick:propOnClick}
) => {
  // console.log(`ClickableFolderItem:`,value, keyName);
  return (
      <div onClick={(e) => {
        if (keyName !== undefined && propOnClick) {
          propOnClick(keyName)
        }
      }}>
        <span>{fileNode.info.name}</span>
        <i className={"fas" +  (expanded ? " fa-caret-down" : " fa-caret-right")} />
      </div>
  );
};

const SimpleFileItem:React.FC<KeyValueRepresentationComponentProps> = (
    {value:fileNode, keyName, parentType, expanded, onClick:propOnClick}
) => {
  // console.log(`SimpleFileItem:`,value, keyName);
  return (
      <div>
        <span>{fileNode.info.name}</span>
        <i className={"fas" +  (expanded ? " fa-caret-down" : " fa-caret-right")} />
      </div>
  );
};

export const getFileTreeItemInfo:GetItemInfoFunc = (fileNode:FileNode):ItemInfo => {

  return {
    type: fileNode.info.type,
    isRecursive: fileNode.info.type === "folder",
    traversalFunc: fileNodeTraversalFunc,
    enclosingClass: "file-tree",
    component: fileNode.info.type === "folder" ? ClickableFolderItem : SimpleFileItem,
  };
}