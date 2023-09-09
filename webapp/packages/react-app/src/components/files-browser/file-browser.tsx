import './file-browser.css';
import {ReduxProject} from "../../state/project";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import {ReduxFile} from "../../state/file";
import {useActions} from "../../hooks/use-actions";
import FileBrowserControlBar, {FileBrowserEvent, FileBrowserEventType} from "./file-browser-control-bar";
import {debugComponent, debugLocalOnlyPendingSupport} from "../../config/global";
import {generateLocalId} from "../../state/id";
import {
  validatePath,
  getCopyPath,
  getFileDir,
  hasTrailingSlash,
  getFilePathParts,
  joinFileParts
} from "../../utils/path";
import {BundleLanguage, pathToBundleLanguage} from "../../state/bundle";
import {CodeLanguage, pathToCodeLanguage} from "../../state/language";
import {FileInfo, FileReduxNode, getFileTreeFromReduxFileList, getSampleFileTree, safeFileNodeTraveral} from "./file-redux-node";
import ComponentTree from "../common/expandable-args/component-tree";
import {getConsoleItemInfo} from "../common/expandable-args/arg-list";
import {getFileInfo} from "prettier";
import {getFileTreeItemInfo} from "./file-browser-redux-tree-item";
import {
  ItemClickFunc,
  ItemEventFunc, ItemEventNameChangeType,
  ItemInfoType,
  ItemNameChangeEventFunc
} from "../common/expandable-args/component-tree-item";
import useForceUpdate from "../../hooks/use-force-update";


interface FilesTreeProps {
  reduxProject: ReduxProject
  onSelect: (fileLocalId:string) => void
}

const FileBrowser: React.FC<FilesTreeProps> = ({reduxProject, onSelect:propOnSelect}) => {
  const [editPathEnabled, setEditPathEnabled] = useState<boolean>(false);
  const fileNameInputRef = useRef<HTMLInputElement|null>(null);
  const filesState = useTypedSelector((state) => state.files);
  const {createFile, updateFile, removeFile, saveFile} = useActions();
  const selectedFileLocalId = reduxProject.selectedFileLocalId || null;
  const [fileTree, setFileTree] = useState<FileReduxNode|null>(null)

  // eslint-disable-next-line
  const projectFiles:ReduxFile[] = useMemo(() => {
    if (reduxProject) {
      const files = Object.entries(filesState.data)
          .filter(([k, v]) => v.projectLocalId === reduxProject.localId)
          .map(([k, v]) => v);

      return files;
    }

    return [];
  }, [reduxProject, filesState.data]);

  if (debugComponent || true) {
    console.log(`FileBrowser:render reduxProject:`, reduxProject);
  }

  // Needed for selecting file
  const projectFilePaths:string[] = useMemo(() => {
    return projectFiles.map(file => file.path);
  }, [projectFiles]);

  useEffect(() => {
    if (debugComponent || true) {
      for (const fp of projectFilePaths) {
        console.log(fp);
      }
    }

    if (projectFiles && projectFiles.length) {
      console.log(`calculating file tree`);
      const rootNode: FileReduxNode = getFileTreeFromReduxFileList(reduxProject.title, projectFiles)
      if (debugComponent || true) {
        console.log(`rootNode:`, rootNode);
      }
      setFileTree(rootNode);
    }
  }, [reduxProject.title, projectFiles]);

  // }, [reduxProject.title, JSON.stringify(projectFilePaths)]);


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


  // Needed for selecting file
  const handleSelectFileClick = (fileLocalId:string) => {
    if (debugComponent || true) {
      console.log(`fileLocalId:`, fileLocalId);
    }

    propOnSelect(fileLocalId);
  }

  const handleSelectFileDoubleClick = (fileLocalId:string) => {
    if (debugComponent) {
      console.log(`handleSelectFileDoubleClick()`, fileLocalId);
    }
    // setSelectedFileLocalId(fileLocalId);
    propOnSelect(fileLocalId);
    setEditPathEnabled(true);
  }

  const handleFilePathChange = (localId:string, value:string) => {
    const bundleLanguage = pathToBundleLanguage(value);
    const language = pathToCodeLanguage(value);

    if (debugComponent) {
      console.log(`${localId}: value=${value} bundleLanguage=${bundleLanguage}`);
    }
    updateFile({localId, path:value, bundleLanguage, language});
  }

  const handleInputKeyPress:React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (debugComponent) {
      console.log(e.key);
    }

    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  }

  const handleInputBlur = () => {
    if (selectedFileLocalId) {
      const reduxFile = filesState.data[selectedFileLocalId];
      if (debugComponent) {
        console.log(`onBlur: file.path:${reduxFile.path}`);
      }

      // Check if folder: The name should not have a slash at the end
      // If the path is a folder path we do not allow it as yet i.e folders have to be created by creating file in them
      // Check if blank
      if (reduxFile.path === "" || hasTrailingSlash(reduxFile.path)) {
        console.log('Error! No file name specified');
        removeFile(selectedFileLocalId);
      } else {
        // We save instantaneously as this is not done very often
        saveFile(reduxFile.localId);
      }
    }
    setEditPathEnabled(false);
  }

  const handleFileBrowserControlEvent = (event: FileBrowserEvent) => {
    let newFilePath = 'src';
    if (selectedFileLocalId) {
      const reduxFile:ReduxFile = filesState.data[selectedFileLocalId];
      if (reduxFile) {
        newFilePath = getFileDir(reduxFile.path);
      }
    }

    if (debugComponent) {
      console.log(`handleFileTreeControlEvent():`, event);
    }

    switch(event.name) {
      case FileBrowserEventType.NEW_FILE:
        const fileLocalId = generateLocalId();
        createFile({
          localId: fileLocalId,
          path: validatePath(newFilePath),
          bundleLanguage: BundleLanguage.UNKNOWN,
          language: CodeLanguage.UNKNOWN,
          content: '',
          contentSynced: true,
          projectLocalId: reduxProject.localId,
          isEntryPoint: false,
        });

        propOnSelect(fileLocalId);
        setEditPathEnabled(true);
        break;

      case FileBrowserEventType.COPY_FILE:
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
          });

          // setSelectedFileLocalId(newFileLocalId);
          propOnSelect(newFileLocalId);
          setEditPathEnabled(true);
        }
        break;

      case FileBrowserEventType.DELETE_FILE:
        if (event.localId) {
          removeFile(event.localId);
        }
        break;
    }
  }

  const fileRootNodeItemInfo:ItemInfoType|null = useMemo(() => {
    console.log(`fileRootNodeItemInfo: fileTree changed!`)
    if (fileTree) {
      // console.log(fileTree);
      return getFileTreeItemInfo(fileTree);
    }
    return null;
  }, [fileTree])

  const handleFileComponentTreeClick:ItemClickFunc = (keyName, itemInfo) => {
    if (debugComponent) {
      console.log(`FileBrowser:handleFileComponentTreeClick()  keyName:${keyName} itemInfo:`, itemInfo);
    }
    const reduxFile = itemInfo.value.info.reduxFile;
    if (reduxFile) {
      propOnSelect(reduxFile.localId);
    }
  }

  const forceUpdateComponent = useForceUpdate();

  const handleFileComponentTreeEvent:ItemEventFunc = (type, data) => {
    if (debugComponent || true) {
      console.log(`FileBrowser:handleFileComponentTreeEvent()  type:${type} data:`, data);
    }

    switch (type) {
      case "change":
        const reduxFile = data.itemInfo.value.info.reduxFile;
        if (reduxFile) {
          // Need to fix the Type below
          const newBasenameOrPath = (data as ItemEventNameChangeType).value;

          let newPath;
          if (newBasenameOrPath[0] === "/") {
            newPath = newBasenameOrPath.substring(1);
          } else {
            const {dirname, basename} = getFilePathParts(reduxFile.path);
            newPath = joinFileParts(dirname, newBasenameOrPath);
          }

          handleFilePathChange(reduxFile.localId, newPath);
          forceUpdateComponent();
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

  return (
    <div style={{flexGrow: 1, display: "flex", flexDirection: "column", overflow: "scroll"}}>
      <FileBrowserControlBar reduxProject={reduxProject} selectedFileLocalId={selectedFileLocalId}
                             onEvent={handleFileBrowserControlEvent}
      />
      {(projectFiles && projectFiles.length>0) ?
          <>
          {/* We can disable the list view */}
          <ul style={{display: undefined}}>
            {
              projectFiles.map(file => {
                const extraFileClasses = ((file.localId === reduxProject.selectedFileLocalId) ? "selected-file" : "");
                return (
                  <li key={file.localId}
                      className={"file-list-item " + extraFileClasses}
                      onClick={() => handleSelectFileClick(file.localId)}
                      onDoubleClick={() => handleSelectFileDoubleClick(file.localId)}
                  >
                    {(selectedFileLocalId === file.localId && editPathEnabled && fileNameInputRef)
                      ? <input
                            autoFocus
                            ref={fileNameInputRef}
                            value={file.path}
                            onChange={(e:any) => handleFilePathChange(file.localId, e.target.value)}
                            onKeyDownCapture={handleInputKeyPress}
                            onBlur={handleInputBlur}
                        />
                      : <span>{file.path}</span>
                    }
                  </li>
                );
              })
            }
          </ul>
          <div>
            {/* TBD: We need to create a FileTree component which encapsulates ComponentTree tree related props */}
            {/* Passing fileRootNodeItemInfo instead of fileTree causes a rendering problem */}
            {/* This can be solved in two ways:
               i) fileRootNodeItemInfo should be different every time even when content are same
               ii) We pass fileTree instead of fileRootNodeItemInfo. Since ComponentTree has getItemInfoFunc it can get
             */}
            {(fileTree) ?
                // We need to support onEvent here as we might support multiple events like onClick, onDoubleClick etc
                <ComponentTree
                    treeName="FileBrowser"
                    itemNode={fileTree}
                    keyName={"root"}
                    parentInfo={null}
                    expanded={true}
                    level={0}
                    // temp disabled for debug tree rerendering
                    // onClick={handleFileComponentTreeClick}
                    onEvent={handleFileComponentTreeEvent}
                    getItemInfoFunc={getFileTreeItemInfo}
                />
                :
                <div>List can't be traversed</div>
            }
          </div>
          </>
        :
          <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
              <span>Create a File</span>
          </div>
      }
    </div>
  )
}

export default FileBrowser;