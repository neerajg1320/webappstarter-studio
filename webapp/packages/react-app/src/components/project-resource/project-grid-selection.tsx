import {ProjectCreate} from "./project-create";
import Select, {SingleValue} from "react-select";
import React, {useMemo, useState} from "react";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import {ReduxProject} from "../../state";

// This component shows us the projects available for a user
// It also allows us to select a project for working

interface ProjectsDashboardProps {
  onProjectChange?: (localId:string) => void;
}

const ProjectGridSelection:React.FC<ProjectsDashboardProps> = ({onProjectChange}) => {
  const [selectedProjectOption, setSelectedProjectOption] =
      useState<SingleValue<{ value: string; label: string; } | null>>(null);

  const projectsState = useTypedSelector((state) => state.projects);
  const projectFiles = useMemo(() => {
    return Object.entries(projectsState.data).map(([k,v]) => v)
  }, [projectsState.data]);

  const projectOptions = useMemo(() => {
    return projectFiles.map(prj => {
      return {value: prj.localId, label: prj.title};
    })
  }, [projectFiles]);

  const handleProjectSelectionChange = (selectedOption:SingleValue<{value: string, label: string}>) => {
    setSelectedProjectOption(selectedOption);
    if (onProjectChange && selectedOption) {
      onProjectChange(selectedOption.value);
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

        {/*{(projectFiles)*/}
        {/*    ?*/}
        {/*    <div className="columns">*/}
        {/*      {projectFiles.map(prj => {*/}
        {/*          return <span className="column">{prj.title}</span>;*/}
        {/*        })*/}
        {/*      }*/}
        {/*    </div>*/}
        {/*    :*/}
        {/*    <div>*/}

        {/*}*/}

      </div>
  );
}

export default ProjectGridSelection;