import React, {useCallback, useMemo, Suspense, lazy, useEffect} from "react";
import {BrowserRouter, Route, Routes, useNavigate} from "react-router-dom";

import {useActions} from "../../hooks/use-actions";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import {ReduxProject} from "../../state";

import AppRouterLandingLayout from "./app-router-landing-layout";
import LandingPage from "../page-landing/landing-page";
import {RoutePath} from "../routes";

import UserRegister from "../page-user/user-register";
import UserLogin from "../page-user/user-login";
import UserActivate from "../page-user/user-activate";
import ProtectedRoute from "../common/protected-route";
import LoadingIndicator from "../common/loading-indicator";
import ProjectPlayground from "../project-resource/project-playground";
import UserPasswordResetConfirm from "../page-user/user-password-reset-confirm";

// import ProjectListGrid from "./components/project-resource/project-list-grid";
// import ProjectCell from "./components/project-cell/project-cell";
// import ProjectEdit from "./components/project-resource/project-edit";
const ProjectListGrid = lazy(() => import("../project-resource/project-list-grid"));
const ProjectCell = lazy(() => import("../project-cell/project-cell"));
const ProjectEdit = lazy(() => import("../project-resource/project-edit"));


const AppRouterWrapper = () => {
  const currentProjectLocalId = useTypedSelector((state) => state.projects.currentProjectId);
  const currentUser = useTypedSelector(state => state.auth.currentUser);

  return (
      <BrowserRouter>
        <Suspense fallback={<LoadingIndicator />}>
        <Routes>
          <Route path={RoutePath.ROOT} element={<AppRouterLandingLayout />}>
            <Route index element={<LandingPage />}/>

            <Route path={RoutePath.USER_REGISTER} element={<UserRegister />} />
            <Route path={RoutePath.USER_LOGIN} element={<UserLogin />} />
            <Route path={`${RoutePath.USER_ACTIVATE}/:key`} element={<UserActivate />} />
            <Route path={`${RoutePath.USER_PASSWORD_RESET_CONFIRM}/:uid/:token`} element={<UserPasswordResetConfirm />} />

            {(currentUser && !currentUser.is_anonymous) &&
              <Route path={RoutePath.PROJECTS}
                     element={
                       <ProtectedRoute>
                         <ProjectListGrid />
                       </ProtectedRoute>
                     }
              />
            }

            <Route path={RoutePath.PROJECT_CELL}
                   element={
                     <ProtectedRoute>
                       {currentProjectLocalId && <ProjectCell />}
                       {!currentProjectLocalId && <h1>Current project is null</h1>}
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
                     // <ProjectEdit isEdit={false} />
                     <ProjectPlayground />
                   }
            />
          </Route>
        </Routes>
        </Suspense>
      </BrowserRouter>
  );
}

export default AppRouterWrapper;