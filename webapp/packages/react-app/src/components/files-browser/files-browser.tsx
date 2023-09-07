import './files-browser.css';
import {ReduxProject} from "../../state/project";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import {ReduxFile} from "../../state/file";
import {useActions} from "../../hooks/use-actions";
import FileBrowserControlBar, {FileTreeEvent, FileTreeEventType} from "./file-browser-control-bar";
import {debugComponent, debugLocalOnlyPendingSupport} from "../../config/global";
import {generateLocalId} from "../../state/id";
import {validatePath, getCopyPath, getFileDir, hasTrailingSlash} from "../../utils/path";
import {BundleLanguage, pathToBundleLanguage} from "../../state/bundle";
import {CodeLanguage, pathToCodeLanguage} from "../../state/language";
import {FileInfo, FileNode, getSampleFileTree} from "./file-node";
import ExpandableSpan from "../common/expandable-args/expandable-span";
import {getConsoleItemInfo} from "../common/expandable-args/arg-list";
import {getFileInfo} from "prettier";
import {getFileTreeItemInfo} from "./file-tree-item";
import {ItemInfo} from "../common/expandable-args/expandable-span-item";


interface FilesTreeProps {
  reduxProject: ReduxProject
  onSelect: (fileLocalId:string) => void
}

const FilesBrowser: React.FC<FilesTreeProps> = ({reduxProject, onSelect:propOnSelect}) => {
  // const [selectedFileLocalId, setSelectedFileLocalId] = useState<string|null>(null);
  const [editPathEnabled, setEditPathEnabled] = useState<boolean>(false);
  const fileNameInputRef = useRef<HTMLInputElement|null>(null);
  const filesState = useTypedSelector((state) => state.files);
  const {createFile, updateFile, removeFile, saveFile} = useActions();
  const selectedFileLocalId = reduxProject.selectedFileLocalId || null;
  const [fileTree, setFileTree] = useState<FileNode|null>(null)

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

  if (debugComponent) {
    console.log(`FileTree:render reduxProject:`, reduxProject);
  }

  // Needed for selecting file
  const projectFilePaths:string[] = useMemo(() => {
    return projectFiles.map(file => file.path);
  }, [projectFiles]);

  useEffect(() => {
    for (const fp of projectFilePaths) {
      console.log(fp);
    }

    const rootNode:FileNode = getSampleFileTree(reduxProject.title)
    console.log(`rootNode:`, rootNode);
    setFileTree(rootNode);
  }, [reduxProject.title, JSON.stringify(projectFilePaths)]);


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
    if (debugComponent) {
      console.log(fileLocalId);
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

  const handleFileTreeControlEvent = (event: FileTreeEvent) => {
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
      case FileTreeEventType.NEW_FILE:
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

      case FileTreeEventType.COPY_FILE:
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

      case FileTreeEventType.DELETE_FILE:
        if (event.localId) {
          removeFile(event.localId);
        }
        break;
    }
  }

  const fileRootNodeItemInfo:ItemInfo|null = useMemo(() => {
    if (fileTree) {
      console.log(fileTree);
      return getFileTreeItemInfo(fileTree);
    }
    return null;
  }, [fileTree])

  return (
    <div style={{
        height:"100%",
        display: "flex", flexDirection: "column",
        // border: "3px solid red",
      }}
    >
      <FileBrowserControlBar
          reduxProject={reduxProject}
          selectedFileLocalId={selectedFileLocalId}
          onEvent={handleFileTreeControlEvent}
      />

      {(projectFiles && projectFiles.length>0)
        ?
          <>
          <ul>
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
            {(fileTree &&fileRootNodeItemInfo && fileRootNodeItemInfo.traversalFunc) ?
                <ExpandableSpan itemInfo={fileRootNodeItemInfo}
                                keyName={'root-key'}
                                type={fileRootNodeItemInfo.type}
                                traversalFunc={fileRootNodeItemInfo.traversalFunc}
                                enclosingClass={fileRootNodeItemInfo.enclosingClass}
                                level={0}
                                parentType={null}
                                // expanded={true}
                                getItemInfoFunc={getFileTreeItemInfo}
                />
                :
                <div>List can't be traversed</div>
            }
          </div>
          </>
        :
          <div style={{
                height: "100%",
                // border: "3px solid lightblue",
                display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"
              }}
            >
              <span>Create a File</span>
          </div>
      }
    </div>
  )
}

export default FilesBrowser;