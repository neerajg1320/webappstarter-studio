import './files-tree.css';
import {ReduxProject} from "../../state/project";
import React, {useMemo, useState} from "react";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import {ReduxFile} from "../../state/file";
import {useActions} from "../../hooks/use-actions";
import FileTreeControlBar, {FileTreeEvent} from "./file-tree-control-bar";

interface FilesTreeProps {
  reduxProject: ReduxProject
  onSelectedFileChange: (fileLocalId:string) => void
}

const FilesTree: React.FC<FilesTreeProps> = ({reduxProject, onSelectedFileChange}) => {
  const [selectedFileLocalId, setSelectedFileLocalId] = useState<string|null>(null);
  const [editEnabled, setEditEnabled] = useState<boolean>(false);
  const filesState = useTypedSelector((state) => state.files);
  const {updateFile} = useActions();

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

  const handleSelectFileClick = (fileLocalId:string) => {
    // console.log(fileLocalId);
    setSelectedFileLocalId(fileLocalId);
    onSelectedFileChange(fileLocalId);
  }

  const handleSelectFileDoubleClick = (fileLocalId:string) => {
    console.log(`handleSelectFileDoubleClick()`, fileLocalId);
    setSelectedFileLocalId(fileLocalId);

    setEditEnabled(true);
  }

  const handleFilePathChange = (localId:string, value:string) => {
    console.log(`${localId}: value=${value}`);
    updateFile({localId, path:value});
  }

  const handleInputBlur = () => {
    console.log(`onBlur:`)
    setEditEnabled(false);
  }

  const handleFileTreeControlEvent = (event: FileTreeEvent) => {
    console.log(`handleFileTreeControlEvent():`, event);
  }

  return (
    <div style={{height:"100%"}}>
      <FileTreeControlBar
          reduxProject={reduxProject}
          onEvent={handleFileTreeControlEvent}
      />
      {(projectFiles && projectFiles.length>0)
        ? <ul>
          {
            projectFiles.map(file => {
              return (
                <li key={file.localId}
                    className={"file-tree-item " + ((file.localId === selectedFileLocalId) ? "selected-file" : "")}
                    onClick={() => handleSelectFileClick(file.localId)}
                    onDoubleClick={() => handleSelectFileDoubleClick(file.localId)}
                >
                  {selectedFileLocalId === file.localId && editEnabled
                    ? <input
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
              // border: "1px solid lightblue",
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