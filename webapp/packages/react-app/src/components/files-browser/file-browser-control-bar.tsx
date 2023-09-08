import './file-browser-control-bar.css';
import React from "react";
import {ReduxProject} from "../../state";

export enum FileBrowserEventType {
  NEW_FILE = 'new_file',
  COPY_FILE = 'copy_file',
  DELETE_FILE = 'delete_file',
}

export interface FileBrowserEvent {
  name: FileBrowserEventType;
  localId?: string;
}

interface FileBrowserControlBarProps {
  reduxProject: ReduxProject;
  selectedFileLocalId: string|null;
  onEvent: (event:FileBrowserEvent) => void;
}

const FileBrowserControlBar:React.FC<FileBrowserControlBarProps> = ({reduxProject,
                                                                selectedFileLocalId,
                                                                onEvent}) => {

  const handleCreateFile: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    onEvent({name: FileBrowserEventType.NEW_FILE});
  }

  const handleCopyFile: React.MouseEventHandler<HTMLButtonElement> = () => {
    if (selectedFileLocalId) {
      onEvent({name: FileBrowserEventType.COPY_FILE, localId: selectedFileLocalId});
    }
  }

  const handleDeleteFile: React.MouseEventHandler<HTMLButtonElement> = () => {
    if (selectedFileLocalId) {
      onEvent({name: FileBrowserEventType.DELETE_FILE, localId: selectedFileLocalId});
    }
  }

  return (
      <div className="file-browser-control-bar">
        <button className="button is-family-secondary is-small" onClick={handleCreateFile}>
          <span className="icon">
              <i className="fas fa-plus" />
          </span>
        </button>
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