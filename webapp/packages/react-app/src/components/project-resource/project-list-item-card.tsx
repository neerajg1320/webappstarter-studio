import {ReduxProject} from "../../state";
import React from "react";
import {useActions} from "../../hooks/use-actions";

interface ProjectCardProps {
  reduxProject: ReduxProject
  onClick?: (localId:string) => void
}

const ProjectListItemCard:React.FC<ProjectCardProps> = ({reduxProject, onClick:propOnClick}) => {
  const { removeProject } = useActions();

  const handleCardClick = () => {
    if (propOnClick) {
      propOnClick(reduxProject.localId);
    }
  }

  const handleDeleteProjectClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    // console.log(`handleDeleteProjectClick():`, reduxProject.localId);
    removeProject(reduxProject.localId)
  }

  return (
    <div className="card" style={{
        borderRadius: "10px", padding: "15px 10px 5px",
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
      <div className="card-footer" style={{
        display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center",
        backgroundColor: "transparent"
      }}>
        <button
            className="button is-family-secondary is-small"
            onClick={handleDeleteProjectClick}
            style={{
              backgroundColor: "transparent", border: "transparent"
            }}
        >
          <span className="icon">
              <i className="fas fa-trash" />
          </span>
        </button>
      </div>

    </div>

  );
}

export default ProjectListItemCard;