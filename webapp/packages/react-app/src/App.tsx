import './App.css';
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useActions} from "./hooks/use-actions";
import {useTypedSelector} from "./hooks/use-typed-selector";
import {autoAuthenticateUser, debugRedux} from "./config/global";
import LandingPage from "./components/page-landing/landing-page";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {RouteName} from "./components/routes";
import UserRegister from "./components/page-user/user-register";
import UserLogin from "./components/page-user/user-login";
import ProjectListGrid from "./components/project-resource/project-list-grid";
import ProjectCell from "./components/project-cell/project-cell";
import {ProjectEdit} from "./components/project-resource/project-edit";
import AppLandingLayout from "./app-landing-layout";
import {ReduxProject} from "./state";


const App = () => {
  if (debugRedux) {
    console.log(`App: render`);
  }

  const {authenticateUser, setCurrentProjectId} = useActions();
  const isAuthenticated = useTypedSelector((state) => state.auth.isAuthenticated)

  const projectsState = useTypedSelector((state) => state.projects);
  const currentProjectId = useTypedSelector((state) => state.projects.currentProjectId);
  const currentProject = useMemo<ReduxProject|null>(() => {
    if (currentProjectId) {
      return projectsState.data[currentProjectId]
    }
    return null;
  }, [projectsState.data, currentProjectId]);

  // Here we should add use login as well
  const { fetchProjectsAndFiles } = useActions();

  useEffect(() => {
    if (autoAuthenticateUser) {
      authenticateUser('neeraj76@yahoo.com', 'Local123');
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjectsAndFiles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const handleProjectChange = useCallback((localId:string) => {
    setCurrentProjectId(localId);
  }, []);

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLandingLayout />}>
            <Route index element={<LandingPage />}/>

            <Route path={RouteName.USER_REGISTER} element={<UserRegister />} />
            <Route path={RouteName.USER_LOGIN} element={<UserLogin />} />

            <Route path={RouteName.PROJECTS} element={<ProjectListGrid onProjectChange={handleProjectChange}/>} />
            <Route path={RouteName.PROJECT_CELL} element={currentProject && <ProjectCell reduxProject={currentProject}/>} />
            <Route path={RouteName.PROJECT_EDIT} element={<ProjectEdit isEdit={true}/>} />
            <Route path={RouteName.PROJECT_NEW} element={<ProjectEdit isEdit={false}/>} />
          </Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App;