import {
  GetItemInfoFunc,
  ItemInfoType, KeyValueRepresentationComponentProps,
  TraversalFunc
} from "../common/expandable-args/component-tree-item";
import {FileReduxNode} from "./file-redux-node";
import React, {FocusEventHandler, useEffect, useMemo, useRef, useState} from "react";
import './file-browser-redux-tree-item.css';
import EditableSpan from "../common/editable-span";
import {debugComponent} from "../../config/global";
import {KeyValueHOComponentProps} from "../common/expandable-args/component-tree";
import { FaFolder, FaFolderOpen} from "react-icons/fa";
import { FaFile } from "react-icons/fa6";


// The main purpose of this file is to pass back getFileTreeItemInfo function
//

const fileNodeTraversalFunc:TraversalFunc = (fileNode:FileReduxNode) => {
  const sortFileNodes = (n1, n2) => {
    // console.log(`sortFileNodes(n1,n2):  node1:`, n1,  `node2`, n2);

    // If they are not of same type then folders get preference over files
    if (n1[1].info.type !== n2[1].info.type) {
      if (n1[1].info.type === 'folder') {
        return -1;
      }
      return 1;
    }

    // If same types then we need to compare the names
    return n1[0].localeCompare(n2[0]);
  }

  if (fileNode && fileNode.childrenFileNodeMap) {
    // console.log(`fileNodeTraversalFunc(): fileNode;${fileNode.info.rootNamePath} children:`, fileNode.childrenFileNodeMap);
    return Object.entries(fileNode.childrenFileNodeMap).sort(sortFileNodes);
  }
  return [];
}


const ClickableFileItem:React.FC<KeyValueHOComponentProps> = ({
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

  const [fileName, setFileName] = useState<string>(itemNode.info.name);


  useEffect(() => {
    setFileName(itemNode.info.name);
  }, [itemNode.info.name]);

  const handleOnChange = (value:string) => {
    console.log(`handleOnChange(): value=${value}`);
    setFileName(value);
  }

  const handleFileNameBlur:FocusEventHandler<HTMLInputElement>  = (e) => {
    if (propOnEvent) {
      // console.log(`handleOnChange(): value=${fileName} and event`);
      propOnEvent("change", {keyName, itemInfo, value:fileName});
    }
  }

  const handleFileNameValidate = (value:string): boolean => {
    return false;
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
            // <i className={"fas" +  (expanded ? " fa-folder-open" : " fa-folder")} />
            expanded? <FaFolderOpen /> :<FaFolder />
            :
            <FaFile  />
        }
        {debugComponent &&
          <>
          {renderCount !== undefined && <span>{`[${renderCount}]`}</span>}
          <span>{itemNode.info.name}</span>
          </>
        }
        <EditableSpan
            value={fileName}
            onChange={handleOnChange}
            opts={{blurOnEnterPressOnly:false}}
            mode={reduxFile && reduxFile.isPathEditing}
            onModeChange={handleModeChange}
            onBlur={handleFileNameBlur}
            onValidate={handleFileNameValidate}
            itemNode={itemNode}
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