import React, {useMemo} from "react";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import ProjectListItemCard from "./project-list-item-card";
import {useNavigate} from "react-router-dom";
import {debugProject} from "../../config/global";
import {RouteName} from "../routes";
import {randomIdGenerator} from "../../state/id";
import {useActions} from "../../hooks/use-actions";
import {ProjectFrameworks} from "../../state";

// This component shows us the projects available for a user
// It also allows us to select a project for working

interface ProjectsDashboardProps {
  onProjectChange?: (localId:string) => void;
}

const ProjectListGrid:React.FC<ProjectsDashboardProps> = ({onProjectChange:propOnProjectChange}) => {
  const navigate = useNavigate();
  const {createAndSetProject} = useActions();

  const projectsState = useTypedSelector((state) => state.projects);
  const projectList = useMemo(() => {
    return Object.entries(projectsState.data).map(([k,v]) => v)
  }, [projectsState.data]);


  const handleProjectCardClick = (localId:string) => {
    if (debugProject) {
      console.log(`handleProjectCardClick:`, localId);
    }

    if (propOnProjectChange) {
      propOnProjectChange(localId);
      navigate(RouteName.PROJECT_CELL);
    }
  }

  const handleNewProjectClick = () => {
    createAndSetProject({
      localId: randomIdGenerator(),
      title: '',
      description: '',
      framework: ProjectFrameworks.REACTJS
    });
    navigate(RouteName.PROJECT_NEW);
  }

  return (
      <div style={{
        height: "100%",
        display:"flex", flexDirection: "column", alignItems: "center", gap: "20px", justifyContent: "center"
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
          border: "1px solid lightblue",
          borderRadius: "15px",
          padding: "40px",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "40px",
          overflowY: "scroll",
        }}>
          {projectList &&
              projectList.map(prj => <ProjectListItemCard key={prj.localId} reduxProject={prj} onClick={handleProjectCardClick}/>)
          }
        </div>
      </div>
  );
}

export default ProjectListGrid;