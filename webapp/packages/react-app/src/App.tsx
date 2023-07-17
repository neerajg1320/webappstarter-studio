import {ProjectResource} from "./components/project-resource/project-resource";
import React, {useEffect, useMemo, useState} from "react";
import {useActions} from "./hooks/use-actions";
import {useTypedSelector} from "./hooks/use-typed-selector";
import ProjectCell from "./components/project-cell/project-cell";
import Select, {SingleValue} from "react-select";
import {ReduxFile, ReduxProject} from "./state";
import {debugRedux} from "./config/global";
import CellList from "./components/cell-list/cell-list";

const App = () => {
  console.log(`App: render`);

  const [selectedProjectOption, setSelectedProjectOption] =
      useState<SingleValue<{ value: string; label: string; } | null>>(null);
  const { fetchProjectsAndFiles } = useActions();

  const projectsState = useTypedSelector((state) => state.projects);
  const filesState = useTypedSelector((state) => state.files);
  const filesList = useMemo<ReduxFile[]|null>(() => {
    if (filesState) {
      return Object.entries(filesState.data).map(([k,v]) => v);
    }
    return null;
  }, [filesState]);

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

  const projectFiles = useMemo<ReduxFile[]|null>(() => {
    if (debugRedux) {
      console.log(`filesState:`, filesState);
    }
    if (selectedProject && filesState) {
      return Object.entries(filesState.data).map(([k, v]) => v).filter(file => {
        return file.projectLocalId && file.projectLocalId === selectedProject.localId;
      });
    }
    return null;
  }, [filesState, selectedProject]);

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
        {/*{selectedProject && <ProjectCell reduxProject={selectedProject}/>}*/}
        {(filesList && filesList.length>0) && <CellList items={filesList}
        />}
      </div>
    </div>
  );
}

export default App;