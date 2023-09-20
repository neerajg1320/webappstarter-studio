import React, {useEffect, useMemo} from "react";
import {useNavigate} from "react-router-dom";
import {useTypedSelector} from "../../../hooks/use-typed-selector";
import ProjectListItemCard from "./project-list-item-card";
import {debugComponent, debugProject} from "../../../config/global";
import {RoutePath} from "../../routes";
import {generateLocalId} from "../../../state/id";
import {useActions} from "../../../hooks/use-actions";
import {ProjectFrameworks, ProjectTemplates, ReactToolchains} from "../../../state";
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
  const {createAndSetProject, fetchProjectsAndFiles} = useActions();

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


  const handleNewProjectClick = () => {
    const localId = generateLocalId();
    createAndSetProject({
      localId,
      title: `Project-${localId}`,
      description: 'This is a web application',
      template: ProjectTemplates.JAVASCRIPT_WITH_CSS,
      framework: ProjectFrameworks.NONE,
      toolchain: ReactToolchains.NONE
    });
    navigate(RoutePath.PROJECT_NEW);
  }

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
          height: "20%",
          width: "100%",
          padding: "0 20px",
          display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-end"
        }}>
          <div style={{
            borderRadius: "15px",
            display: "flex",
          }}>
            <button className="button is-family-secondary"
                    style={{backgroundColor: "cornflowerblue", borderRadius: "5px"}}
                    onClick={handleNewProjectClick}
            >
              New Project
            </button>
          </div>
        </div>
        <div style={{
          height: "80%",
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