import React, {useMemo} from "react";
import {useTypedSelector} from "../../../../hooks/use-typed-selector";
import ProjectListItemCard from "./project-list-item-card";
import {debugComponent, debugProject} from "../../../../config/global";
import {useActions} from "../../../../hooks/use-actions";
import './project-list-grid.css';
import {getProjects} from "../../../../state/helpers/project-helpers";
import {ReduxProject} from "../../../../state";

// This component shows us the projects available for a user
// It also allows us to select a project for working

interface ProjectListGridProps {
  projects: ReduxProject[];
  visibility:boolean;
}

const ProjectListGrid:React.FC<ProjectListGridProps> = ({projects, visibility:propVisibility}) => {
  // const debugComponent = true;

  // Grid Layout
  // Ref: https://codepen.io/TomckySan/pen/mxVbgR
  return (
      <div className="project-list-grid" style={{
        width: "100%",
        height: "100%",
        // padding: "0 40px",
        display:"flex",
        flexDirection: "column", 
        alignItems: "center", 
        // gap: "20px", 
        justifyContent: "center",
        visibility: propVisibility ? 'visible' : 'hidden',
      }}
      >
        <div style={{
          height: "100%",
          width: "100%",

          // border: "1px solid lightblue",
          // borderRadius: "15px",

          display: "grid",
          // gridTemplateColumns: "repeat(auto-fit, 350px)",
          gridRowGap: "40px",
          gridColumnGap: "40px",
          justifyContent: "space-evenly",

          // display: "flex",
          // justifyContent: "space-evenly",
          // alignItems: "flex-start",
          // flexWrap: "wrap",

          // gap: "40px",
          // overflowY: "auto",
          // padding: "40px"
        }}>
          {projects &&
              projects.map(prj => <ProjectListItemCard key={prj.localId} reduxProject={prj} />)
          }
        </div>
      </div>
  );
}

export default ProjectListGrid;