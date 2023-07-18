import './file-tree-control-bar.css';
import React from "react";
import {ReduxProject} from "../../state";

interface FileTreeControlBarProps {
  reduxProject: ReduxProject;
  onEvent: () => {};
}

const FileTreeControlBar:React.FC<FileTreeControlBarProps> = ({reduxProject, onEvent}) => {
  const handleCreateFile: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    console.log("We need to add file");
  }

  return (
      <div className="file-tree-control-bar">
        <button className="button is-family-secondary is-small" onClick={handleCreateFile}>
          <span className="icon">
              <i className="fas fa-plus" />
          </span>
        </button>
        <button className="button is-family-secondary is-small" onClick={() => {}}>
          <span className="icon">
              <i className="fas fa-copy" />
          </span>
        </button>
      </div>
  );
}

export default FileTreeControlBar;