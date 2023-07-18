import './App.css';
import {ProjectResource} from "./components/project-resource/project-resource";
import React, {useEffect, useMemo, useState} from "react";
import {useActions} from "./hooks/use-actions";
import {useTypedSelector} from "./hooks/use-typed-selector";
import ProjectCell from "./components/project-cell/project-cell";
import Select, {SingleValue} from "react-select";
import {ReduxProject} from "./state";
import {debugRedux} from "./config/global";

const App = () => {
  if (debugRedux) {
    console.log(`App: render`);
  }

  const [selectedProjectOption, setSelectedProjectOption] =
      useState<SingleValue<{ value: string; label: string; } | null>>(null);
  const { fetchProjectsAndFiles } = useActions();

  const projectsState = useTypedSelector((state) => state.projects);

  const projectOptions = useMemo(() => {
    return Object.entries(projectsState.data).map(([k,v]) => v).map(prj => {
      return {value: prj.localId, label: prj.title};
    })
  }, [projectsState]);

  const selectedProject = useMemo<ReduxProject|null>(() => {
    if (debugRedux) {
      console.log(`projectsState:`, projectsState);
    }

    if (selectedProjectOption) {
      const {value} = selectedProjectOption;
      return Object.entries(projectsState.data).map(([k,v]) => v).filter(prj => prj.localId === value)[0];
    }
    return null;
  }, [projectsState, selectedProjectOption]);


  useEffect(() => {
    fetchProjectsAndFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleProjectSelectionChange = (selectedOption:SingleValue<{value: string, label: string}>) => {
    // console.log(selectedOption);
    setSelectedProjectOption(selectedOption);
  }

  return (
    <div style={{display:"flex", flexDirection:"column", alignItems: "center"}}>
      <div style={{
          display:"flex", flexDirection:"row", width:"100%", alignItems: "center",
        }}
      >
        <ProjectResource />
        <Select
            value={selectedProjectOption}
            className="project-select is-primary is-small"
            options={projectOptions}
            onChange={handleProjectSelectionChange}
        />
      </div>

      <div style={{width: "100%", marginTop: "10px"}}>
        {selectedProject && <ProjectCell reduxProject={selectedProject}/>}
      </div>
    </div>
  );
}

export default App;