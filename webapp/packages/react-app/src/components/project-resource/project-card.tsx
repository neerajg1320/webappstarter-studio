import {ReduxProject} from "../../state";
import React from "react";

interface ProjectCardProps {
  reduxProject: ReduxProject
  onClick?: (localId:string) => void
}

const ProjectCard:React.FC<ProjectCardProps> = ({reduxProject, onClick:propOnClick}) => {
  const handleCardClick = () => {
    if (propOnClick) {
      propOnClick(reduxProject.localId);
    }
  }

  return (
    <div className="card" style={{
        borderRadius: "10px", padding: "15px 10px",
        backgroundColor: "cornflowerblue",
        cursor: "pointer"
      }}
      onClick={handleCardClick}
    >
      <div className="card-header" style={{padding: "0 10px", margin: "0"}}>
        <div>
          {reduxProject.title}
        </div>
        <div>
          <img />
        </div>
      </div>
      <div className="card-content">
        <div style={{display:"flex", flexDirection:"row", gap:"10px"}}>
          <span style={{width:"50%"}}>Folder:</span><span>{reduxProject.folder}</span>
        </div>
        <div style={{display:"flex", flexDirection:"row", gap:"10px"}}>
          <span>Framework:</span><span>{reduxProject.framework}</span>
        </div>
      </div>
      <div className="card-footer">
        {}
      </div>

    </div>

  );
}

export default ProjectCard;