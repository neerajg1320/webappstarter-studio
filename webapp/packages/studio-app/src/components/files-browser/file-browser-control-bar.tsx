import './file-browser-control-bar.css';
import React, {useRef} from "react";
import {ReduxProject} from "../../state";

export enum FileBrowserControlBarEventType {
  NEW_FILE = 'new_file',
  NEW_FOLDER = 'new_folder',
  COPY_FILE = 'copy_file',
  UPLOAD_FILES = 'upload_files',
  DELETE_FILE = 'delete_file',
}

export interface FileBrowserControlBarEvent {
  name: FileBrowserControlBarEventType;
  localId?: string;
  files?: File[];
}

interface FileBrowserControlBarProps {
  reduxProject: ReduxProject;
  selectedFileLocalId: string|null;
  onEvent: (event:FileBrowserControlBarEvent) => void;
}

const FileBrowserControlBar:React.FC<FileBrowserControlBarProps> = ({reduxProject,
                                                                selectedFileLocalId,
                                                                onEvent}) => {
  const uploadFileRef = useRef<HTMLInputElement>();

  const handleCreateFile: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    onEvent({name: FileBrowserControlBarEventType.NEW_FILE});
  }

  const handleCreateFolder: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    onEvent({name: FileBrowserControlBarEventType.NEW_FOLDER});
  }

  const handleCopyFile: React.MouseEventHandler<HTMLButtonElement> = () => {
    if (selectedFileLocalId) {
      onEvent({name: FileBrowserControlBarEventType.COPY_FILE, localId: selectedFileLocalId});
    }
  }

  const handleUploadFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    onEvent({name: FileBrowserControlBarEventType.UPLOAD_FILES, files: uploadedFiles});
    e.target.value = null;
  }

  const handleDeleteFile: React.MouseEventHandler<HTMLButtonElement> = () => {
    if (selectedFileLocalId) {
      onEvent({name: FileBrowserControlBarEventType.DELETE_FILE, localId: selectedFileLocalId});
    }
  }

  return (
      <div className="file-browser-control-bar">
        <button className="button is-family-secondary is-small" onClick={handleCreateFile}>
          <span className="icon">
              <i className="fas fa-file-circle-plus" />
          </span>
        </button>
        {/*<button className="button is-family-secondary is-small" onClick={handleCreateFolder}>*/}
        {/*  <span className="icon">*/}
        {/*      <i className="fas fa-folder-plus" />*/}
        {/*  </span>*/}
        {/*</button>*/}
        <button className="button is-family-secondary is-small" onClick={handleCopyFile}>
          <span className="icon">
              <i className="fas fa-copy" />
          </span>
        </button>
        <button className="button is-family-secondary is-small" onClick={e => {
          if (uploadFileRef.current) {
            uploadFileRef.current.click();
          }
        }}>
          <span className="icon">
              <i className="fas fa-upload" />
          </span>
          <input ref={uploadFileRef} type="file" style={{display:"none"}} onChange={handleUploadFile} multiple />
        </button>
        <button className="button is-family-secondary is-small" onClick={handleDeleteFile}>
          <span className="icon">
              <i className="fas fa-trash" />
          </span>
        </button>
      </div>
  );
}

export default FileBrowserControlBar;