import React, {useEffect, useMemo} from "react";
import {useNavigate} from "react-router-dom";
import {useTypedSelector} from "../../../../hooks/use-typed-selector";
import ProjectListItemCard from "./project-list-item-card";
import {debugComponent, debugProject} from "../../../../config/global";
import {useActions} from "../../../../hooks/use-actions";
import './project-list-grid.css';

// This component shows us the projects available for a user
// It also allows us to select a project for working

interface ProjectListGridProps {
  visibility:boolean;
}

const ProjectListGrid:React.FC<ProjectListGridProps> = ({visibility:propVisibility}) => {
  // const debugComponent = true;
  const navigate = useNavigate();
  const isAuthenticated = useTypedSelector<boolean>(state => state.auth.isAuthenticated);
  const {fetchProjectsAndFiles} = useActions();

  const projectsState = useTypedSelector((state) => state.projects);
  const projectList = useMemo(() => {
    return Object.entries(projectsState.data).map(([k,v]) => v).filter(item => item.confirmed)
  }, [projectsState.data]);


  useEffect(() => {
    if (debugComponent) {
      console.log(`ProjectListGrid:useEffect[] projectState:`, projectsState);
    }
    if (!isAuthenticated) {
      console.log(`Error! projects listed before authentication `)
    } else {
      if (projectsState.loadCount <= 0) {
        fetchProjectsAndFiles();
      }
    }

    return () => {
      if (debugComponent) {
        console.log(`ProjectListGrid:useEffect[] destroyed`);
      }
    }
  }, []);

  return (
      <div className="project-list-grid" style={{
        width: "100%",
        height: "100%",
        padding: "0 40px",
        display:"flex",
        flexDirection: "column", alignItems: "center", gap: "20px", justifyContent: "center",
        visibility: propVisibility ? 'visible' : 'hidden',
      }}
      >
        <div style={{
          height: "100%",
          width: "100%",
          // border: "1px solid lightblue",
          borderRadius: "15px",

          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "40px",
          overflowY: "scroll",
        }}>
          {projectList &&
              projectList.map(prj => <ProjectListItemCard key={prj.localId} reduxProject={prj} />)
          }
        </div>
      </div>
  );
}

export default ProjectListGrid;