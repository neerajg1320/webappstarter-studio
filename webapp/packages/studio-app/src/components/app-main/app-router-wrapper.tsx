import React, {Suspense, lazy} from "react";
import {BrowserRouter, Route, Routes, useNavigate} from "react-router-dom";

import {useTypedSelector} from "../../hooks/use-typed-selector";


import AppRouterLandingLayout from "./app-router-landing-layout";
import LandingPage from "../page-landing/landing-page";
import {RoutePath} from "../routes";

import UserRegister from "../page-user/user-register";
import UserLogin from "../page-user/user-login";
import UserActivate from "../page-user/user-activate";
import ProtectedRoute from "../common/protected-route";
import LoadingIndicator from "../common/loading-indicator";
import ProjectPlayground from "../project-resource/project-playground";
import UserPasswordChange from "../page-user/user-password-change";


const ProjectListView = lazy(() => import("../project-resource/project-list/project-list-view"));
const ProjectCell = lazy(() => import("../project-resource/project-cell/project-cell"));
const ProjectEdit = lazy(() => import("../project-resource/project-edit"));
import {withLifecyleLogger} from "../../hoc/logger";
import ProjectFetch from "../project-resource/project-fetch";

const AppRouterWrapper = () => {
  const currentProjectLocalId = useTypedSelector((state) => state.projects.currentProjectId);

  return (
      <BrowserRouter>
        <Suspense fallback={<LoadingIndicator />}>
        <Routes>
          <Route path={RoutePath.ROOT} element={<AppRouterLandingLayout />}>
            <Route index element={<LandingPage />}/>

            <Route path={RoutePath.USER_REGISTER} element={<UserRegister />} />
            <Route path={RoutePath.USER_LOGIN} element={<UserLogin />} />
            <Route path={`${RoutePath.USER_ACTIVATE}/:key`} element={<UserActivate />} />
            <Route path={`${RoutePath.USER_PASSWORD_RESET_CONFIRM}/:uid/:token`} element={<UserPasswordChange resetConfirm={true} />} />
            <Route path={`${RoutePath.USER_PASSWORD_CHANGE}`} element={<UserPasswordChange resetConfirm={false} />} />

            <Route path={RoutePath.PROJECTS} element={
                     <ProtectedRoute>
                       <ProjectListView />
                     </ProtectedRoute>
                   }
            />

            <Route path={`${RoutePath.PROJECTS}/:idType/:idValue`} element={
                <ProjectFetch />
            }
            />

            <Route path={`${RoutePath.PROJECT_CELL}/:localId`}
                   element={
                     <ProtectedRoute>
                       {currentProjectLocalId && <ProjectCell />}
                       {!currentProjectLocalId && <h1>Select a project</h1>}
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
                     <ProjectPlayground />
                   }
            />
          </Route>
        </Routes>
        </Suspense>
      </BrowserRouter>
  );
}

export default withLifecyleLogger(AppRouterWrapper, false);