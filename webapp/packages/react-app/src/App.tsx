import './App.css';
import React, {useCallback, useEffect, useMemo} from "react";
import {useActions} from "./hooks/use-actions";
import {useTypedSelector} from "./hooks/use-typed-selector";
import {debugComponent} from "./config/global";
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
import ProtectedRoute from "./components/common/protected-route";
import AppRouterWrapper from "./app-router-wrapper";


const App = () => {
  if (debugComponent) {
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
    console.log('App: first render');
    authenticateUser('neeraj76@yahoo.com', 'Local123');
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjectsAndFiles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return (
    <AppRouterWrapper />
  );
}

export default App;