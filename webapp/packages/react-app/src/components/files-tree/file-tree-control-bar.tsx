import './file-tree-control-bar.css';
import React from "react";
import {ReduxProject} from "../../state";

interface FileTreeControlBarProps {
  reduxProject: ReduxProject;
}
const FileTreeControlBar:React.FC<FileTreeControlBarProps> = ({reduxProject}) => {
  return (
      <div className="file-tree-control-bar">

      </div>
  );
}

export default FileTreeControlBar;