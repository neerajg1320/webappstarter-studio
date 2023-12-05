import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./project-list-item-card.css";
import { ReduxProject } from "../../../../state/project";
import { useActions } from "../../../../hooks/use-actions";
import { RoutePath } from "../../../routes";
import { CiMenuKebab } from "react-icons/ci";
import { FiEdit3 } from "react-icons/fi";
import { MdOutlineDeleteOutline } from "react-icons/md";

interface ProjectCardProps {
  reduxProject: ReduxProject;
  onClick?: (localId: string) => void;
}

const ProjectListItemCard: React.FC<ProjectCardProps> = ({
  reduxProject,
  onClick: propOnClick,
}) => {
  const { deleteFiles, removeProject } = useActions();
  const navigate = useNavigate();
  const { setCurrentProjectId, updateProject } = useActions();
  const [openCardMenu, setOpenCardMenu] = useState(false);

  const selectAndNavigateToProject = () => {
    if (propOnClick) {
      propOnClick(reduxProject.localId);
    }
    setCurrentProjectId(reduxProject.localId);
    navigate(RoutePath.PROJECT_CELL);
  };

  const handleEditProjectClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    localId: string
  ) => {
    console.log(`handleEditProjectClick()`);
    e.stopPropagation();
    setCurrentProjectId(localId);
    navigate(RoutePath.PROJECT_EDIT);
  };

  const handleDeleteProjectClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    const choice = window.confirm(
      "Are you sure you want to delete your project? You will lose all the files."
    );
    console.log(`choice:`, choice);

    if (choice) {
      deleteFiles(reduxProject.localId);
      removeProject(reduxProject.localId);
    }
  };

  const handleOpenCardMenu = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setOpenCardMenu(!openCardMenu);

    console.log("clicked card menu");
  };

  return (
    <div
      className="card"
      onClick={(e) => {
        // console.log(`Set selectedFileLocalId to entryFileLocalId:`, reduxProject.entryFileLocalId);
        updateProject({
          localId: reduxProject.localId,
          selectedFileLocalId: reduxProject.entryFileLocalId,
        });
        selectAndNavigateToProject();
      }}
    >
      <div
        className="card-header"
        
      >
        <button className="card-actions-icon" onClick={handleOpenCardMenu}>
          <CiMenuKebab size={18}/>
        </button>
        {openCardMenu && (
          <ul className="card-actions">
            <li className="card-actions-item">
              <button onClick={(e) => handleEditProjectClick(e, reduxProject.localId)}>
                <FiEdit3 />
              </button>
            </li>
            <li className="card-actions-item">
              <button onClick={handleDeleteProjectClick}>

              <MdOutlineDeleteOutline />
              </button>
            </li>
          </ul>
        )}
        <div className="card-title">{reduxProject.title}</div>
        {/* {reduxProject.size !== undefined && reduxProject.size > 0 && (
          <div>{reduxProject.size + " Bytes"}</div>
        )} */}
      </div>
      <div className="card-content" style={{ flexGrow: 1 }}>
        <div className="card-item">
          <label>Template:</label>
          <span className="value">{reduxProject.template}</span>
        </div>
        <div className="card-item">
          <label>Entry File:</label>
          <span
            className="value"
            onClick={(e) => {
              e.stopPropagation();
              // console.log(`Set selectedFileLocalId to entryFileLocalId:`, reduxProject.entryFileLocalId);
              updateProject({
                localId: reduxProject.localId,
                selectedFileLocalId: reduxProject.entryFileLocalId,
              });
              selectAndNavigateToProject();
            }}
          >
            {reduxProject.entry_path}
          </span>
        </div>
        {reduxProject.entryHtmlFileLocalId && (
          <div className="card-item">
            <label>Entry HTML:</label>
            <span
              className="value"
              onClick={(e) => {
                e.stopPropagation();
                // console.log(`Set selectedFileLocalId to entryHtmlFileLocalId:`, reduxProject.entryHtmlFileLocalId);
                updateProject({
                  localId: reduxProject.localId,
                  selectedFileLocalId: reduxProject.entryHtmlFileLocalId,
                });
                selectAndNavigateToProject();
              }}
            >
              {reduxProject.entry_html_path}
            </span>
          </div>
        )}
      </div>
      <div
        className="card-footer"
        style={{
          border: "none",
          backgroundColor: "rgba(255,255,255, 5%)",
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
      
      </div>
    </div>
  );
};

export default ProjectListItemCard;






{/* <button
className="button is-family-secondary is-small"
onClick={(e) => handleEditProjectClick(e, reduxProject.localId)}
>
<span className="icon">
  {/* hello */}
//   <i className="fas fa-pen" />
// </span>
// </button>
// <button
// className="button is-family-secondary is-small"
// onClick={handleDeleteProjectClick}
// >
// <span className="icon">
//   <i className="fas fa-trash" />
// </span>
// </button> */}
