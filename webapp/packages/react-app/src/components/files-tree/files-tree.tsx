import './files-tree.css';
import {ReduxProject} from "../../state/project";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import {ReduxCreateFilePartial, ReduxFile} from "../../state/file";
import {useActions} from "../../hooks/use-actions";
import FileTreeControlBar, {FileTreeEvent, FileTreeEventType} from "./file-tree-control-bar";
import {isRegexMatch} from "../../utils/regex";
import {debugComponent} from "../../config/global";
import {randomIdGenerator} from "../../state/id";
import {getCopyPath, getFilePathParts, joinFileParts} from "../../utils/path";

interface FilesTreeProps {
  reduxProject: ReduxProject
  onSelectedFileChange: (fileLocalId:string) => void
}

const FilesTree: React.FC<FilesTreeProps> = ({reduxProject, onSelectedFileChange}) => {
  const [selectedFileLocalId, setSelectedFileLocalId] = useState<string|null>(null);
  const [editPathEnabled, setEditPathEnabled] = useState<boolean>(false);
  const fileNameInputRef = useRef<HTMLInputElement|null>(null);
  const filesState = useTypedSelector((state) => state.files);
  const {createFile, updateFile, removeFile} = useActions();

  // eslint-disable-next-line
  const projectFiles:ReduxFile[] = useMemo(() => {
    if (reduxProject) {
      const files = Object.entries(filesState.data)
          .filter(([k, v]) => v.projectLocalId === reduxProject.localId)
          .map(([k, v]) => v);

      return files;
    }

    return [];
  }, [reduxProject.localId, filesState.data]);

  if (debugComponent  ) {
    console.log(`FileTree:render projectFiles:`, projectFiles);
  }

  useEffect(() => {
    console.log(`FilesTree: projectFiles:`, projectFiles);

    if (reduxProject.entryFileLocalId) {
      setSelectedFileLocalId(reduxProject.entryFileLocalId);
    } else {
      console.log(`attribute 'entryFileLocalId' not set in projet '${reduxProject.title}'`)
    }
  }, [reduxProject.localId]);

  useEffect(() => {
    if (selectedFileLocalId) {
      onSelectedFileChange(selectedFileLocalId);
    }
  }, [selectedFileLocalId]);

  const handleSelectFileClick = (fileLocalId:string) => {
    // console.log(fileLocalId);
    setSelectedFileLocalId(fileLocalId);
  }

  const handleSelectFileDoubleClick = (fileLocalId:string) => {
    console.log(`handleSelectFileDoubleClick()`, fileLocalId);
    setSelectedFileLocalId(fileLocalId);
    setEditPathEnabled(true);
  }

  const handleFilePathChange = (localId:string, value:string) => {
    console.log(`${localId}: value=${value}`);
    updateFile({localId, path:value});
  }

  const handleInputBlur = () => {
    if (selectedFileLocalId) {
      const reduxFile = filesState.data[selectedFileLocalId];
      console.log(`onBlur: file.path:${reduxFile.path}`);
      // If the path is a folder path we do not allow it as yet i.e folders have to be created by creating file in them
      if (isRegexMatch(/^.*\/$/, reduxFile.path)) {
        console.log('Error! No file name specified');
        removeFile(selectedFileLocalId);
      }
    }
    setEditPathEnabled(false);
  }

  const handleFileTreeControlEvent = (event: FileTreeEvent) => {
    console.log(`handleFileTreeControlEvent():`, event);
    switch(event.name) {
      case FileTreeEventType.NEW_FILE:
        const fileLocalId = randomIdGenerator();
        createFile({
          localId: fileLocalId,
          path: 'src/',
          fileType: 'javascript',
          content: '',
          contentSynced: false,
          projectLocalId: reduxProject.localId,
          isEntryPoint: false,
        });

        setSelectedFileLocalId(fileLocalId);
        setEditPathEnabled(true);
        break;

      case FileTreeEventType.COPY_FILE:
        if (event.localId) {
          const origFile = filesState.data[event.localId];
          if (!origFile) {
            console.log(`Error! original file '${event.localId}' not found`);
            break;
          }

          const newFileLocalId = randomIdGenerator();

          const {dirname, basename} = getFilePathParts(origFile.path);
          const newBasename = getCopyPath(basename);
          // const newPath = joinFileParts(dirname, newBasename);
          const newPath = getCopyPath(origFile.path);

          createFile({
            localId: newFileLocalId,
            path: newPath,
            fileType: 'javascript',
            content: '',
            contentSynced: false,
            projectLocalId: reduxProject.localId,
            isEntryPoint: false,
          });

          setSelectedFileLocalId(newFileLocalId);
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

  return (
    <div style={{
        height:"100%",
        display: "flex", flexDirection: "column",
        // border: "3px solid red",
      }}
    >
      <FileTreeControlBar
          reduxProject={reduxProject}
          selectedFileLocalId={selectedFileLocalId}
          onEvent={handleFileTreeControlEvent}
      />

      {(projectFiles && projectFiles.length>0)
        ? <ul>
          {
            projectFiles.map(file => {
              const extraFileClasses = ((file.localId === selectedFileLocalId) ? "selected-file" : "");
              return (
                <li key={file.localId}
                    className={"file-tree-item " + extraFileClasses}
                    onClick={() => handleSelectFileClick(file.localId)}
                    onDoubleClick={() => handleSelectFileDoubleClick(file.localId)}
                >
                  {selectedFileLocalId === file.localId && editPathEnabled
                    ? <input
                          autoFocus
                          ref={fileNameInputRef}
                          value={file.path}
                          onChange={(e) => handleFilePathChange(file.localId, e.target.value)}
                          onBlur={handleInputBlur}
                      />
                    : <span>{file.path}</span>
                  }
                </li>
              );
            })
          }
        </ul>
        : <div style={{
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

export default FilesTree;