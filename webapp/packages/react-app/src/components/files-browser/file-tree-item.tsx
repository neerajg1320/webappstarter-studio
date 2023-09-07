import {
  GetItemInfoFunc,
  ItemInfo, KeyValueRepresentationComponentProps,
  TraversalFunc
} from "../common/expandable-args/expandable-span-item";
import {FileNode} from "./file-node";
import React from "react";
import './file-tree-item.css';
import {debugComponent} from "../../config/global";


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
  const handleFolderClick = (e:React.MouseEvent) => {
    if (keyName !== undefined && keyName !== null && propOnClick) {
      propOnClick(keyName)
      if (debugComponent || true) {
        const fileNode:FileNode = itemInfo.value;

        console.log(`ExpandableSpan:handleExpandClick() itemInfo:${
            JSON.stringify(fileNode,
                function (key, value) {
                  if (key === "parentNode") {
                    if (value != null) {
                      return value.info.name;
                    }
                  }
                  return value;
                },
                2)
        }`)
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