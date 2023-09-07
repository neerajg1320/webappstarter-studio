import {TraversalFunc} from "../common/expandable-args/expandable-span-item";
import {FileNode} from "./file-node";

const fileNodeTraversalFunc:TraversalFunc = (fileNode:FileNode) => {
  if (fileNode && fileNode.children) {
    return fileNode.children.map((node, index) => {
      return [index, node];
    })
  }
  return [];
}