import React from "react";
import {ReduxProject} from "../../state";

interface FileTreeControlBarProps {
  reduxProject: ReduxProject;
}
const FileTreeControlBar:React.FC<FileTreeControlBarProps> = ({reduxProject}) => {
  return (
      <div style={{
        height: "20px", width: "100%",
        border:"1px solid yellow",
        display: "flex", flexDirection:"row", justifyContent: "flex-end"
      }}
      >

      </div>
  );
}

export default FileTreeControlBar;