import './file-browser-control-bar.css';
import React from "react";
import {ReduxProject} from "../../state";

export enum FileBrowserControlBarEventType {
  NEW_FILE = 'new_file',
  NEW_FOLDER = 'new_folder',
  COPY_FILE = 'copy_file',
  DELETE_FILE = 'delete_file',
}

export interface FileBrowserControlBarEvent {
  name: FileBrowserControlBarEventType;
  localId?: string;
}

interface FileBrowserControlBarProps {
  reduxProject: ReduxProject;
  selectedFileLocalId: string|null;
  onEvent: (event:FileBrowserControlBarEvent) => void;
}

const FileBrowserControlBar:React.FC<FileBrowserControlBarProps> = ({reduxProject,
                                                                selectedFileLocalId,
                                                                onEvent}) => {

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
        <button className="button is-family-secondary is-small" onClick={handleDeleteFile}>
          <span className="icon">
              <i className="fas fa-trash" />
          </span>
        </button>
      </div>
  );
}

export default FileBrowserControlBar;