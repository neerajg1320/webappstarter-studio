import ProjectCell from "../project-cell/project-cell";
import React, {useCallback, useMemo, useState} from "react";
import ProjectListGrid from "../project-resource/project-list-grid";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import {BrowserRouter, Routes, Route, useNavigate} from "react-router-dom";
import AppRouterLayout from "./app-router-layout";
import {ProjectNew} from "../project-resource/project-new";

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
          <Route path="/" element={<AppRouterLayout />}>
            <Route index element={<ProjectListGrid onProjectChange={handleProjectChange}/>} />
            <Route path="edit_project" element={selectedProject && <ProjectCell reduxProject={selectedProject}/>} />
            <Route path="new_project" element={<ProjectNew />} />
          </Route>
        </Routes>
      </BrowserRouter>
  );

}

export default AppMainView;