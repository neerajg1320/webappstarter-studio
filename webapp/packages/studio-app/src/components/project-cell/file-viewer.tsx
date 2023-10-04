import './file-viewer.css';
import FileCellControlBar from "../file-cell/file-cell-control-bar";
import React, {Suspense, useMemo} from "react";
import CodeFallbackEditor from "../file-cell/code-fallback-editor";
import {CodeLanguage} from "../../state/language";
import {ReduxFile, ReduxProject} from "../../state";
import CodeEditor from "../file-cell/code-editor";
import {FileContentType, getFileContentType} from "../../utils/path";


interface FileViewerProps {
  reduxProject?: ReduxProject;
  editedFile: ReduxFile;
  onChange: (v:string) => void;
};


const FileViewer:React.FC<FileViewerProps> = ({reduxProject, editedFile, onChange:propOnChange}) => {
  const fileContentType = useMemo<FileContentType>(() => {
    return getFileContentType(editedFile.path);
  }, [editedFile]);

  return (
    <>
      <span>{fileContentType}</span>
      <div className="file-cell-control-bar-wrapper">
        {editedFile && <FileCellControlBar reduxProject={reduxProject} reduxFile={editedFile}/>}
      </div>

      {(editedFile && editedFile.contentSynced) ?
          <>
          {(fileContentType === FileContentType.CODE) &&
          <Suspense fallback={<CodeFallbackEditor value={editedFile?.content || ''}
                                                  onChange={(newValue) => handleEditorChange(newValue)}/>}>
            <CodeEditor
                modelKey={editedFile?.localId}
                value={editedFile?.content || ""}
                language={editedFile?.language || CodeLanguage.UNKNOWN}
                onChange={propOnChange}
                disabled={!editedFile}
            />
          </Suspense>
          }
          </>
          :
          <div style={{
            height: "100%", width: "100%",
            display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
          }}
          >
            <h3>Select a File</h3>
          </div>
      }
    </>
  );
}

export default FileViewer;