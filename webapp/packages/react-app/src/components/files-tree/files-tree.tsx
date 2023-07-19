import './files-tree.css';
import {ReduxProject} from "../../state/project";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import {ReduxFile} from "../../state/file";
import {useActions} from "../../hooks/use-actions";
import FileTreeControlBar, {FileTreeEvent, FileTreeEventType} from "./file-tree-control-bar";

interface FilesTreeProps {
  reduxProject: ReduxProject
  onSelectedFileChange: (fileLocalId:string) => void
}

const FilesTree: React.FC<FilesTreeProps> = ({reduxProject, onSelectedFileChange}) => {
  const [selectedFileLocalId, setSelectedFileLocalId] = useState<string|null>(null);
  const [editPathEnabled, setEditPathEnabled] = useState<boolean>(false);
  const fileNameInputRef = useRef<HTMLInputElement|null>(null);
  const filesState = useTypedSelector((state) => state.files);
  const {updateFile, removeFile} = useActions();

  // eslint-disable-next-line
  const projectFiles:ReduxFile[] = useMemo(() => {
    if (reduxProject) {
      const files = Object.entries(filesState.data)
          .filter(([k, v]) => v.projectLocalId === reduxProject.localId)
          .map(([k, v]) => v);

      // console.log(`files:`, files);
      return files;
    }

    return [];
  }, [reduxProject, filesState.data]);

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
    console.log(`onBlur:`)
    setEditPathEnabled(false);
  }

  const handleFileTreeControlEvent = (event: FileTreeEvent) => {
    console.log(`handleFileTreeControlEvent():`, event);
    switch(event.name) {
      case FileTreeEventType.NEW_FILE:
        setSelectedFileLocalId(event.localId);
        setEditPathEnabled(true);
        break;

      case FileTreeEventType.DELETE_FILE:
        removeFile(event.localId);
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