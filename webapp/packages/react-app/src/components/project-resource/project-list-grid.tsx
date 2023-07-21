import {ProjectNew} from "./project-new";
import Select, {SingleValue} from "react-select";
import React, {useMemo, useState} from "react";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import ProjectListItemCard from "./project-list-item-card";
import {useNavigate} from "react-router-dom";

// This component shows us the projects available for a user
// It also allows us to select a project for working

interface ProjectsDashboardProps {
  onProjectChange?: (localId:string) => void;
}

const ProjectListGrid:React.FC<ProjectsDashboardProps> = ({onProjectChange:propOnProjectChange}) => {
  const navigate = useNavigate();
  const showOldViewDeprecated = false;
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
    if (propOnProjectChange && selectedOption) {
      propOnProjectChange(selectedOption.value);
      navigate('/edit_project');
    }
  }

  const handleProjectCardClick = (localId:string) => {
    console.log(`handleProjectCardClick:`, localId);
    if (propOnProjectChange) {
      propOnProjectChange(localId);
      navigate('/edit_project');
    }
  }

  const handleNewProjectClick = () => {
    navigate('/new_project');
  }

  return (
      <div style={{
        display:"flex", flexDirection: "column", alignItems: "center", gap: "20px", justifyContent: "center"
      }}
      >
        {/*// The current project view which has to be removed*/}
        {showOldViewDeprecated &&
          <div style={{
            width: "100%",
            border: "1px solid lightblue",
            display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between"
          }}>
            <ProjectNew/>
            <Select
                value={selectedProjectOption}
                className="project-select is-primary is-small"
                options={projectOptions}
                onChange={handleProjectSelectionChange}
            />
          </div>
        }

        <div style={{marginTop: "40px"}}></div>
        <div style={{
          width: "100%",
          display: "flex", flexDirection: "row", justifyContent: "flex-end"
        }}>
          <div>
            <button className="button is-family-secondary"
                    style={{backgroundColor: "cornflowerblue", borderRadius: "5px", marginBottom: "20px"}}
                    onClick={handleNewProjectClick}
            >
              New Project
            </button>
          </div>
        </div>
        <div style={{
          width: "100%",
          border: "1px solid lightblue",
          borderRadius: "15px",
          padding: "40px",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "40px",
          overflowX: "scroll"
        }}>
          {projectList &&
              projectList.map(prj => <ProjectListItemCard key={prj.localId} reduxProject={prj} onClick={handleProjectCardClick}/>)
          }
        </div>

      </div>
  );
}

export default ProjectListGrid;