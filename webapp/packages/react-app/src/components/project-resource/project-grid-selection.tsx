import {ProjectCreate} from "./project-create";
import Select, {SingleValue} from "react-select";
import React, {useMemo, useState} from "react";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import {ReduxProject} from "../../state";
import {useNavigate} from "react-router-dom";
import ProjectCard from "./project-card";

// This component shows us the projects available for a user
// It also allows us to select a project for working

interface ProjectsDashboardProps {
  onProjectChange?: (localId:string) => void;
}

const ProjectGridSelection:React.FC<ProjectsDashboardProps> = ({onProjectChange}) => {
  const navigate = useNavigate();
  const [selectedProjectOption, setSelectedProjectOption] =
      useState<SingleValue<{ value: string; label: string; } | null>>(null);

  const projectsState = useTypedSelector((state) => state.projects);
  const projectList = useMemo(() => {
    return Object.entries(projectsState.data).map(([k,v]) => v)
  }, [projectsState.data]);

  const projectOptions = useMemo(() => {
    return projectList.map(prj => {
      return {value: prj.localId, label: prj.title};
    })
  }, [projectList]);

  const handleProjectSelectionChange = (selectedOption:SingleValue<{value: string, label: string}>) => {
    setSelectedProjectOption(selectedOption);
    if (onProjectChange && selectedOption) {
      onProjectChange(selectedOption.value);
    }

    navigate('/editor');
  }

  const handleProjectCardClick = (localId:string) => {
    console.log(`handleProjectCardClick:`, localId);
  }

  return (
      <div style={{
        width: "100%",
        display:"flex", flexDirection: "column", alignItems: "center", gap: "20px",
      }}
      >
        {/*// The current project view which has to be removed*/}
        <div style={{
          width: "80%",
          border: "1px solid lightblue",
          display:"flex", flexDirection:"row", alignItems: "center", justifyContent: "space-between"
        }}>
          <ProjectCreate />
          <Select
              value={selectedProjectOption}
              className="project-select is-primary is-small"
              options={projectOptions}
              onChange={handleProjectSelectionChange}
          />
        </div>

        <div style={{
          width: "90%", height: "60vh",
          border: "1px solid lightblue",
          borderRadius: "15px",
          marginTop: "40px",
          padding: "40px",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "40px",
          overflowX: "scroll"
        }}>
          {projectList &&
              projectList.map(prj => <ProjectCard key={prj.localId} reduxProject={prj} onClick={handleProjectCardClick}/>)
          }
        </div>

      </div>
  );
}

export default ProjectGridSelection;