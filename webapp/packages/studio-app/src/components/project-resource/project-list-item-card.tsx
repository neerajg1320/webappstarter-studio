import './project-list-item-card.css';
import {ReduxProject} from "../../state";
import React from "react";
import {useActions} from "../../hooks/use-actions";
import {useNavigate} from "react-router-dom";
import {RoutePath} from "../routes";

interface ProjectCardProps {
  reduxProject: ReduxProject
  onClick?: (localId:string) => void
}

const ProjectListItemCard:React.FC<ProjectCardProps> = ({reduxProject, onClick:propOnClick}) => {
  const { removeProject } = useActions();
  const navigate = useNavigate();
  const {setCurrentProjectId, updateProject} = useActions();

  const selectAndNavigateToProject = () => {
    if (propOnClick) {
      propOnClick(reduxProject.localId);
    }
    setCurrentProjectId(reduxProject.localId);
    navigate(RoutePath.PROJECT_CELL);
  }

  const handleEditProjectClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, localId:string) => {
    console.log(`handleEditProjectClick()`);
    e.stopPropagation();
    setCurrentProjectId(localId);
    navigate(RoutePath.PROJECT_EDIT);
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
      onClick={(e) => {
        // console.log(`Set selectedFileLocalId to entryFileLocalId:`, reduxProject.entryFileLocalId);
        updateProject({localId:reduxProject.localId, selectedFileLocalId: reduxProject.entryFileLocalId});
        selectAndNavigateToProject();
      }}
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
        <div className="card-item" >
          <label>Template:</label>
          <span className="value">
            {reduxProject.template}
          </span>
        </div>
        <div className="card-item">
          <label>Entry Javascript:</label>
          <span
              className="value"
              onClick={(e) => {
                e.stopPropagation();
                // console.log(`Set selectedFileLocalId to entryFileLocalId:`, reduxProject.entryFileLocalId);
                updateProject({localId:reduxProject.localId, selectedFileLocalId: reduxProject.entryFileLocalId});
                selectAndNavigateToProject();
              }}
          >
            {reduxProject.entry_path}
          </span>
        </div>
        {reduxProject.entryHtmlFileLocalId &&
            <div className="card-item" >
              <label>Entry HTML:</label>
              <span
                  className="value"
                  onClick={(e) => {
                    e.stopPropagation();
                    // console.log(`Set selectedFileLocalId to entryHtmlFileLocalId:`, reduxProject.entryHtmlFileLocalId);
                    updateProject({localId:reduxProject.localId, selectedFileLocalId: reduxProject.entryHtmlFileLocalId});
                    selectAndNavigateToProject();
                  }}
              >
                {reduxProject.entry_html_path}
              </span>
            </div>
        }
      </div>
      <div className="card-footer" style={{
        display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center",
        backgroundColor: "transparent",
      }}>
        <button className="button is-family-secondary is-small"
                onClick={(e) => handleEditProjectClick(e, reduxProject.localId)}
        >
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