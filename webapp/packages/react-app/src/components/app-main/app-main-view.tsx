import ProjectCell from "../project-cell/project-cell";
import React, {useCallback, useMemo, useState} from "react";
import ProjectListGrid from "../project-resource/project-list-grid";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import {BrowserRouter, Routes, Route, useNavigate} from "react-router-dom";
import AppRouterLayout from "./app-router-layout";
import {ProjectEdit} from "../project-resource/project-edit";
import {useActions} from "../../hooks/use-actions";
import {RouteName} from "../routes";
import {ReduxProject} from "../../state";

const AppMainView = () => {
  // This has to be removed from here and we have to use the current project in the redux state
  // const [selectedProjectLocalId, setSelectedProjectLocalId] = useState<string|null>(null);
  const { setCurrentProjectId } = useActions();
  const projectsState = useTypedSelector((state) => state.projects);
  const currentProjectId = useTypedSelector((state) => state.projects.currentProjectId);
  const currentProject = useMemo<ReduxProject|null>(() => {
    if (currentProjectId) {
      return projectsState.data[currentProjectId]
    }
    return null;
  }, [projectsState.data, currentProjectId]);

  const handleProjectChange = useCallback((localId:string) => {
    setCurrentProjectId(localId);
  }, []);

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppRouterLayout />}>
            <Route index element={<ProjectListGrid onProjectChange={handleProjectChange}/>} />
            <Route path={RouteName.PROJECT_CELL} element={currentProject && <ProjectCell reduxProject={currentProject}/>} />
            <Route path={RouteName.PROJECT_EDIT} element={<ProjectEdit isEdit={true}/>} />
            <Route path={RouteName.PROJECT_NEW} element={<ProjectEdit isEdit={false}/>} />
          </Route>
        </Routes>
      </BrowserRouter>
  );

}

export default AppMainView;