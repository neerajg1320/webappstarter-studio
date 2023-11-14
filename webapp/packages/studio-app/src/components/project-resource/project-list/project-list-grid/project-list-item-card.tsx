import React from "react";
import {useNavigate} from "react-router-dom";
import './project-list-item-card.css';
import {ReduxProject} from "../../../../state/project";
import {useActions} from "../../../../hooks/use-actions";
import {RoutePath} from "../../../routes";

interface ProjectCardProps {
  reduxProject: ReduxProject
  onClick?: (localId:string) => void
}

const ProjectListItemCard:React.FC<ProjectCardProps> = ({reduxProject, onClick:propOnClick}) => {
  const { deleteFiles, removeProject } = useActions();
  const navigate = useNavigate();
  const {setCurrentProjectId, updateProject} = useActions();

  const selectAndNavigateToProject = () => {
    if (propOnClick) {
      propOnClick(reduxProject.localId);
    }
    setCurrentProjectId(reduxProject.localId);
    navigate(`${RoutePath.PROJECT_CELL}/${reduxProject.localId}`);
  }

  const handleEditProjectClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, localId:string) => {
    console.log(`handleEditProjectClick()`);
    e.stopPropagation();
    setCurrentProjectId(localId);
    navigate(RoutePath.PROJECT_EDIT);
  }

  const handleDeleteProjectClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    const choice = window.confirm(
        'Are you sure you want to delete your project? You will lose all the files.'
    );
    console.log(`choice:`, choice);

    if (choice) {
      deleteFiles(reduxProject.localId);
      removeProject(reduxProject.localId);
    }
  }


  return (
    <div className="card" style={{
        height: "200px",
        width: "350px",
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
      <div className="card-header" style={{padding: "0 10px", margin: "0",
        display: "flex" , flexDirection: "row", justifyContent: "space-between"
      }}>
        <div>
          {reduxProject.title}
        </div>
        {(reduxProject.size !== undefined && reduxProject.size > 0) &&
          <div>
            {reduxProject.size + " Bytes"}
          </div>
        }
      </div>
      <div className="card-content" style={{flexGrow: 1}}>
        <div className="card-item" >
          <label>Template:</label>
          <span className="value">
            {reduxProject.template}
          </span>
        </div>
        <div className="card-item">
          <label>Entry File:</label>
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
        border: "none", backgroundColor: "rgba(255,255,255, 5%)",
        display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center",
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