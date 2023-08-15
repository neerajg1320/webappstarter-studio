import React, {useCallback, useMemo, Suspense, lazy} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";

import {useActions} from "./hooks/use-actions";
import {useTypedSelector} from "./hooks/use-typed-selector";
import {ReduxProject} from "./state";

import AppLandingLayout from "./app-landing-layout";
import LandingPage from "./components/page-landing/landing-page";
import {RoutePath} from "./components/routes";

import UserRegister from "./components/page-user/user-register";
import UserLogin from "./components/page-user/user-login";
import UserActivate from "./components/page-user/user-activate";
import ProtectedRoute from "./components/common/protected-route";
import LoadingIndicator from "./components/common/loading-indicator";

// import ProjectListGrid from "./components/project-resource/project-list-grid";
// import ProjectCell from "./components/project-cell/project-cell";
// import ProjectEdit from "./components/project-resource/project-edit";
const ProjectListGrid = lazy(() => import("./components/project-resource/project-list-grid"));
const ProjectCell = lazy(() => import("./components/project-cell/project-cell"));
const ProjectEdit = lazy(() => import("./components/project-resource/project-edit"));


const AppRouterWrapper = () => {
  const {setCurrentProjectId} = useActions();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
      <BrowserRouter>
        <Suspense fallback={<LoadingIndicator />}>
        <Routes>
          <Route path={RoutePath.ROOT} element={<AppLandingLayout />}>
            <Route index element={<LandingPage />}/>

            <Route path={RoutePath.USER_REGISTER} element={<UserRegister />} />
            <Route path={RoutePath.USER_LOGIN} element={<UserLogin />} />
            <Route path={`${RoutePath.USER_ACTIVATE}/:key`} element={<UserActivate />} />

            <Route path={RoutePath.PROJECTS}
                   element={
                     <ProtectedRoute>
                       <ProjectListGrid onProjectChange={handleProjectChange}/>
                     </ProtectedRoute>
                   }
            />
            <Route path={RoutePath.PROJECT_CELL}
                   element={
                     <ProtectedRoute>
                       {currentProject && <ProjectCell reduxProject={currentProject}/>}
                     </ProtectedRoute>
                   }
            />
            <Route path={RoutePath.PROJECT_EDIT}
                   element={
                     <ProtectedRoute>
                       <ProjectEdit isEdit={true} />
                     </ProtectedRoute>
                   }
            />
            <Route path={RoutePath.PROJECT_NEW}
                   element={
                     <ProtectedRoute>
                       <ProjectEdit isEdit={false} />
                     </ProtectedRoute>
                   }
            />
            <Route path={RoutePath.PROJECT_PLAYGROUND}
                   element={
                     <ProtectedRoute>
                       <ProjectEdit isEdit={false} />
                     </ProtectedRoute>
                   }
            />
          </Route>
        </Routes>
        </Suspense>
      </BrowserRouter>
  );
}

export default AppRouterWrapper;