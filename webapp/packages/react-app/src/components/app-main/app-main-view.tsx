import ProjectCell from "../project-cell/project-cell";
import React, {useCallback, useMemo, useState} from "react";
import ProjectListGrid from "../project-resource/project-list-grid";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import {BrowserRouter, Routes, Route, useNavigate} from "react-router-dom";
import AppRouterLayout from "./app-router-layout";
import {ProjectNew} from "../project-resource/project-new";
import {useActions} from "../../hooks/use-actions";

const AppMainView = () => {
  // This has to be removed from here and we have to use the current project in the redux state
  // const [selectedProjectLocalId, setSelectedProjectLocalId] = useState<string|null>(null);
  const { setCurrentProjectId } = useActions();
  const projectsState = useTypedSelector((state) => state.projects);
  const currentProjectId = useTypedSelector((state) => state.projects.currentProjectId);
  const currentProject = useMemo(() => {
    return projectsState.data[currentProjectId]
  }, [projectsState.data, currentProjectId]);

  const handleProjectChange = useCallback((localId:string) => {
    setCurrentProjectId(localId);
  }, []);

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppRouterLayout />}>
            <Route index element={<ProjectListGrid onProjectChange={handleProjectChange}/>} />
            <Route path="edit_project" element={currentProject && <ProjectCell reduxProject={currentProject}/>} />
            <Route path="new_project" element={<ProjectNew />} />
          </Route>
        </Routes>
      </BrowserRouter>
  );

}

export default AppMainView;