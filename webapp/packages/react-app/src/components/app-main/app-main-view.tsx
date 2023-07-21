import ProjectCell from "../project-cell/project-cell";
import React, {useCallback, useMemo, useState} from "react";
import ProjectGridSelection from "../project-resource/project-grid-selection";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import {BrowserRouter, Routes, Route, useNavigate} from "react-router-dom";
import AppNavLayout from "./app-nav-layout";

const AppMainView = () => {
  const [selectedProjectLocalId, setSelectedProjectLocalId] = useState<string|null>(null);
  const projectsState = useTypedSelector((state) => state.projects);

  const selectedProject = useMemo(() => {
    if (selectedProjectLocalId && projectsState.data) {
      return projectsState.data[selectedProjectLocalId]
    }
  }, [projectsState.data, selectedProjectLocalId])

  const handleProjectChange = useCallback((localId:string) => {
    setSelectedProjectLocalId(localId);
  }, []);

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppNavLayout />}>
            <Route index element={<ProjectGridSelection onProjectChange={handleProjectChange}/>} />
            <Route path="editor" element={selectedProject && <ProjectCell reduxProject={selectedProject}/>} />
          </Route>
        </Routes>
      </BrowserRouter>
  );

}

export default AppMainView;