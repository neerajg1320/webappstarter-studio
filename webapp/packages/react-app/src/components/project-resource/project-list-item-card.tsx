import './project-list-item-card.css';
import {ReduxProject} from "../../state";
import React from "react";
import {useActions} from "../../hooks/use-actions";
import {useNavigate} from "react-router-dom";
import {RouteName} from "../routes";

interface ProjectCardProps {
  reduxProject: ReduxProject
  onClick?: (localId:string) => void
}

const ProjectListItemCard:React.FC<ProjectCardProps> = ({reduxProject, onClick:propOnClick}) => {
  const { removeProject } = useActions();
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (propOnClick) {
      propOnClick(reduxProject.localId);
    }
  }

  const handleEditProjectClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    navigate(RouteName.PROJECT_EDIT);
  }

  const handleDeleteProjectClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    removeProject(reduxProject.localId)
  }

  return (
    <div className="card" style={{
        height: "200px",
        borderRadius: "10px", padding: "15px 10px 5px",
        backgroundColor: "cornflowerblue",
        cursor: "pointer",
        display: "flex", flexDirection: "column", justifyContent: "space-evenly"
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
      <div className="card-content" style={{flexGrow: 1}}>
        <div style={{display:"flex", flexDirection:"row", gap:"10px"}}>
          <span style={{width:"50%"}}>Folder:</span><span>{reduxProject.folder}</span>
        </div>
        <div style={{display:"flex", flexDirection:"row", gap:"10px"}}>
          <span>Framework:</span><span>{reduxProject.framework}</span>
        </div>
      </div>
      <div className="card-footer" style={{
        display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center",
        backgroundColor: "transparent",
      }}>
        <button className="button is-family-secondary is-small" onClick={handleEditProjectClick}>
          <span className="icon">
              <i className="fas fa-pen" />
          </span>
        </button>
        <button className="button is-family-secondary is-small" onClick={handleDeleteProjectClick}>
          <span className="icon">
              <i className="fas fa-trash" />
          </span>
        </button>
      </div>

    </div>

  );
}

export default ProjectListItemCard;