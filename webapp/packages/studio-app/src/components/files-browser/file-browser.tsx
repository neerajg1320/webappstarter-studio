import './file-browser.css';
import {ReduxProject} from "../../state/project";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import {ReduxFile} from "../../state/file";
import {useActions} from "../../hooks/use-actions";
import FileBrowserControlBar, {
  FileBrowserControlBarEvent,
  FileBrowserControlBarEventType
} from "./file-browser-control-bar";
import {debugComponent, debugLocalOnlyPendingSupport} from "../../config/global";
import {generateLocalId} from "../../state/id";
import {getCopyPath, getFileBasenameParts, getFilePathParts, joinFileParts} from "../../utils/path";
import {BundleLanguage} from "../../state/bundle";
import {CodeLanguage} from "../../state/language";
import {FileInfo, FileReduxNode, getFileTreeFromReduxFileList} from "./file-redux-node";
import ComponentTree from "../common/expandable-args/component-tree";
import {getFileTreeItemInfo} from "./file-browser-redux-tree-item";
import {
  ItemClickFunc,
  ItemEventFunc,
  ItemEventNameChangeType,
  ItemInfoType,
} from "../common/expandable-args/component-tree-item";
import useDifferentialCallback from "../../hooks/use-differential-callback";
import {getFileFromLocalId} from "../../state/helpers/file-helpers";

export type FileBrowserEventType = "select" | "path-change" | "file-delete" | "files-reload";
export type FileBrowserEventData = {
  localId?: string;
  newPath?: string;
}
export type FileBrowserEventFunc = (type: FileBrowserEventType, data?:FileBrowserEventData) => void;

interface FilesTreeProps {
  reduxProject: ReduxProject;
  onSelect: (fileLocalId: string) => void;
  onEvent?: FileBrowserEventFunc;
}


const FileBrowser: React.FC<FilesTreeProps> = ({reduxProject, onSelect:propOnSelect, onEvent:propOnEvent}) => {
  const fileNameInputRef = useRef<HTMLInputElement|null>(null);
  const filesState = useTypedSelector((state) => state.files);
  const {createFile, removeFile, deleteFile, saveFile} = useActions();
  const selectedFileLocalId = reduxProject.selectedFileLocalId || null;
  const [fileTree, setFileTree] = useState<FileReduxNode|null>(null)

  // eslint-disable-next-line
  const projectFiles:ReduxFile[] = useMemo(() => {
    if (reduxProject) {
      const files = Object.entries(filesState.data)
          .filter(([k, v]) => v.projectLocalId === reduxProject.localId)
          .map(([k, v]) => v);

      return files as ReduxFile[];
    }

    return [];
  }, [reduxProject, filesState.data]);

  if (debugComponent) {
    console.log(`FileBrowser:render reduxProject:`, reduxProject);
  }


  useEffect(() => {
    if (debugComponent || false) {
      console.log(`FileBrowser:useEffect[projectFiles] projectFiles`)
      projectFiles.forEach((file, index) => {
        console.log(`${index}: ${file.path}`);
      })
    }

    if (projectFiles && projectFiles.length) {
      // console.log(`calculating file tree`);
      const rootNode: FileReduxNode = {...getFileTreeFromReduxFileList(reduxProject.title, projectFiles)};
      if (debugComponent) {
        console.log(`rootNode:`, rootNode);
      }

      setTimeout(() => {
        setFileTree(rootNode);
      }, 5)
    }
  }, [reduxProject.title, projectFiles]);

  // useEffect(() => {
  //   if (debugComponent) {
  //     console.log(`FileBrowser:useEffect[fileTree] fileTree:`, fileTree);
  //   }
  // }, [fileTree]);

  // Needed for selecting file
  useEffect(() => {
    if (debugComponent) {
      console.log(`FilesTree: projectFiles:`, projectFiles);
    }

    if (reduxProject.entryFileLocalId) {
      // setSelectedFileLocalId(reduxProject.entryFileLocalId);
    } else {
      if (debugLocalOnlyPendingSupport) {
        console.log(`attribute 'entryFileLocalId' not set in projet '${reduxProject.title}'`);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduxProject.localId]);


  const handleFileBrowserControlBarEvent = (event: FileBrowserControlBarEvent) => {
    let newFilePath = 'src';
    if (selectedFileLocalId) {
      const reduxFile:ReduxFile = filesState.data[selectedFileLocalId];
      if (reduxFile) {
        const {dirname, basename} = getFilePathParts(reduxFile.path);
        const {ext} = getFileBasenameParts(basename);
        // This becomes important for fileTree, we have to give extension as well
        newFilePath = joinFileParts(dirname, `.${ext}`);
      }
    }

    if (debugComponent) {
      console.log(`handleFileTreeControlEvent():`, event);
    }

    switch(event.name) {
      case FileBrowserControlBarEventType.NEW_FILE:
        const fileLocalId = generateLocalId();
        createFile({
          localId: fileLocalId,
          path: newFilePath,
          bundleLanguage: BundleLanguage.UNKNOWN,
          language: CodeLanguage.UNKNOWN,
          content: '',
          contentSynced: true,
          projectLocalId: reduxProject.localId,
          isEntryPoint: false,
          isPathEditing: true,
        });

        propOnSelect(fileLocalId);

        break;

      case FileBrowserControlBarEventType.NEW_FOLDER:
        // This meta approach won't work till the time we add support for folders in reduxFile

        break;
      case FileBrowserControlBarEventType.COPY_FILE:
        if (event.localId) {
          const origFile = filesState.data[event.localId];
          if (!origFile) {
            console.log(`Error! original file '${event.localId}' not found`);
            break;
          }

          const newFileLocalId = generateLocalId();
          const newPath = getCopyPath(origFile.path);

          createFile({
            localId: newFileLocalId,
            path: newPath,
            bundleLanguage: origFile.bundleLanguage,
            language: CodeLanguage.UNKNOWN,
            content: origFile.content,
            contentSynced: true,
            projectLocalId: reduxProject.localId,
            isEntryPoint: false,
            isPathEditing: true,
          });

          propOnSelect(newFileLocalId);
        }
        break;

      case FileBrowserControlBarEventType.UPLOAD_FILES:
        // console.log(`file-browser: uploaded files;`, event.files);
        let folderPath = 'assets';
        if (reduxProject.selectedFileLocalId) {
          const selectedFile = getFileFromLocalId(filesState, reduxProject.selectedFileLocalId)
          if (selectedFile) {
            folderPath = getFilePathParts(selectedFile.path).dirname;
          }
        }
        console.log(`file-browser: folderPath:`, folderPath);
        for (const file of event.files) {
          console.log(`file-browser; file:`, file);

          const newFileLocalId = generateLocalId();
          const newPath = joinFileParts(folderPath, file.name);

          createFile({
            localId: newFileLocalId,
            path: newPath,
            // bundleLanguage: origFile.bundleLanguage,
            // language: CodeLanguage.UNKNOWN,
            // content: origFile.content,
            localFile: file,
            contentSynced: false,
            projectLocalId: reduxProject.localId,
            isEntryPoint: false,
            isPathEditing: false,
          });

          saveFile(newFileLocalId);
        }
        break;

      case FileBrowserControlBarEventType.DELETE_FILE:
        if (event.localId) {
          removeFile(event.localId);
          // TBD: We should be marking the file selection properly here.
          // updateProject({})
          if (propOnEvent) {
            propOnEvent("file-delete", {localId: event.localId});
          }
        }
        break;

      case FileBrowserControlBarEventType.RELOAD_FILES:
        if (propOnEvent) {
          propOnEvent("files-reload");
        }
        break;
    }
  }


  const handleFileComponentTreeClick:ItemClickFunc = (keyName, itemInfo) => {
    if (debugComponent) {
      console.log(`FileBrowser:handleFileComponentTreeClick()  keyName:${keyName} itemInfo:`, itemInfo);
    }
    const reduxFile = itemInfo.value.info.reduxFile;
    if (reduxFile) {
      propOnSelect(reduxFile.localId);
    }
  }

  const handleFileComponentTreeEvent:ItemEventFunc = (type, data) => {
    if (debugComponent) {
      console.log(`FileBrowser:handleFileComponentTreeEvent()  type:${type} data:`, data);
    }

    switch (type) {
      case "change":
        if (data.itemInfo.value.info.type === "folder") {
          console.log(`Folder '${data.itemInfo.value.info.name}' name change not supported`);
          break;
        }

        const reduxFile = data.itemInfo.value.info.reduxFile;
        const reduxFileDir = getFilePathParts(reduxFile.path)["dirname"];

        if (reduxFile) {
          // Need to fix the Type below
          const newBasenameOrPath = (data as ItemEventNameChangeType).value;

          // console.log(`newPath: '${newBasenameOrPath}'`);

          let newPath:string|null = null;

          // Here we check if it is an absolute path and remove leading slash in case it is.
          if (newBasenameOrPath[0] === "/") {
            newPath = newBasenameOrPath.substring(1);
          } else {
            // This would work only for file name change. The redux path should have been copied
            const {dirname, basename} = getFilePathParts(newBasenameOrPath);
            // console.log(`dirname:${dirname} basename:${basename}`)
            const {name, ext} = getFileBasenameParts(basename);
            // console.log(`name:${name} ext:${ext}`)

            if (!name) {
              deleteFile(reduxFile.localId);
            } else {
              newPath = joinFileParts(reduxFileDir, newBasenameOrPath);
            }
          }

          // Add event
          if (newPath && propOnEvent) {
            propOnEvent("path-change", {localId: reduxFile.localId, newPath});
          }
        } else {
          console.log(`Name change for folder not supported yet`);
        }
        break;

      case "click":
        break;

      case "double-click":
        break;

      default:
        console.error(`FileBrowser:handleFileComponentTreeEvent()  event type '${type}' not supported`);
    }
  }


  const [dragStartFileInfo, setDragStartFileInfo] = useState<FileInfo|null>(null);

  const handleDragStart = (itemInfo:ItemInfoType) => {
    if (debugComponent || false) {
      if (itemInfo.value.info.type === "file") {
        console.log(`handleDragStart():`, itemInfo.value.info.reduxFile.path);
      } else {
        // For a folder the redux file does not exist yet
        console.log(`handleDragStart():`, itemInfo.value.info.rootNamePath.join("/"));
      }
    }

    if (itemInfo.value.info.type === "file") {
      setDragStartFileInfo(itemInfo.value.info);
    }
  }

  // This is necessary for the onDrop to trigger
  const handleDragOver = useDifferentialCallback((itemInfo:ItemInfoType) => {
    if (debugComponent || false) {
      if (itemInfo.value.info.type === "file") {
        console.log(`handleDragOver():`, itemInfo.value.info.reduxFile.path);
      } else {
        // For a folder the redux file does not exist yet
        console.log(`handleDragOver():`, itemInfo.value.info.rootNamePath.join("/"));
      }
    }

  });

  const handleDrop = (itemInfo:ItemInfoType) => {
    if (debugComponent || false) {
      if (itemInfo.value.info.type === "file") {
        console.log(`handleDrop():`, itemInfo.value.info.reduxFile.path);
      } else {
        // For a folder the redux file does not exist yet
        console.log(`handleDrop():`, itemInfo.value.info.rootNamePath.join("/"));
      }
    }

    let dstFolder;

    if (itemInfo.value.info.type === "folder") {
      dstFolder = itemInfo.value.info.rootNamePath.slice(1).join("/");
    } else {
      // console.log(itemInfo.value.info.path)
      dstFolder = getFilePathParts(itemInfo.value.info.reduxFile.path)["dirname"]
    }


    if (dragStartFileInfo) {
      const srcFilePath = dragStartFileInfo.reduxFile.path;

      const srcFileBaseName = getFilePathParts(srcFilePath)["basename"];
      const dstFilePath = joinFileParts(dstFolder, srcFileBaseName);

      if (debugComponent) {
        console.log(`srcFilePath:'${srcFilePath}' dstFilePath:'${dstFilePath}'`);
      }

      if (srcFilePath === dstFilePath) {
        console.log(`The srcFilePath:${srcFilePath} is same as dstFilePath:${dstFilePath}`);
        return;
      }

      if (propOnEvent) {
        propOnEvent("path-change", {localId: dragStartFileInfo.reduxFile.localId, newPath:dstFilePath});
      }
    }

  }

  const renderCountRef = useRef<number>(0);
  renderCountRef.current += 1;

  return (
    <div className="file-browser">
      <FileBrowserControlBar reduxProject={reduxProject} selectedFileLocalId={selectedFileLocalId} onEvent={handleFileBrowserControlBarEvent} />

      {(projectFiles && projectFiles.length>0) ?
      <>
      <div className="file-browser-panel">
        {(fileTree) ?
            // We need to support onEvent here as we might support multiple events like onClick, onDoubleClick etc
            <ComponentTree
                treeName="FileBrowser"
                itemNode={fileTree}
                keyName={"root"}
                parentInfo={null}
                expanded={true}
                intermediateExpanded={true}
                level={0}
                onClick={handleFileComponentTreeClick}
                onEvent={handleFileComponentTreeEvent}
                getItemInfoFunc={getFileTreeItemInfo}
                draggable={true}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                renderCount={renderCountRef.current}
            />
            :
            <div>List can't be traversed</div>
        }

      </div>
      {(debugComponent || false) &&
      <div style={{display:"flex", flexDirection:"column", alignItems: "flex-start"}}>
        {
          projectFiles.map((file, index) => {
            return <span key={index}>{index}{":  "}{file.path}</span>;
          })
        }
      </div>
      }
      </>
    :
      <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
          <span>Create a File</span>
      </div>
      }
    </div>
  )
}

export default React.memo(FileBrowser);