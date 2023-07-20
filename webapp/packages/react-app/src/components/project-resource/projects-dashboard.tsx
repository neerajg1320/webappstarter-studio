import {ProjectCreate} from "./project-create";
import Select, {SingleValue} from "react-select";
import React, {useMemo, useState} from "react";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import {ReduxProject} from "../../state";

interface ProjectsDashboardProps {
  onProjectChange?: (project:ReduxProject) => void;
}

const ProjectsDashboard:React.FC<ProjectsDashboardProps> = ({onProjectChange}) => {
  const projectsState = useTypedSelector((state) => state.projects);
  const [selectedProjectOption, setSelectedProjectOption] =
      useState<SingleValue<{ value: string; label: string; } | null>>(null);

  const projectOptions = useMemo(() => {
    return Object.entries(projectsState.data).map(([k,v]) => v).map(prj => {
      return {value: prj.localId, label: prj.title};
    })
  }, [projectsState]);

  const handleProjectSelectionChange = (selectedOption:SingleValue<{value: string, label: string}>) => {
    setSelectedProjectOption(selectedOption);
    if (onProjectChange && selectedOption) {
      onProjectChange(projectsState.data[selectedOption.value]);
    }
  }

  return (
      <div style={{
        display:"flex", flexDirection:"row", width:"100%", alignItems: "center",
      }}
      >
        <ProjectCreate />
        <Select
            value={selectedProjectOption}
            className="project-select is-primary is-small"
            options={projectOptions}
            onChange={handleProjectSelectionChange}
        />
      </div>
  );
}

export default ProjectsDashboard;