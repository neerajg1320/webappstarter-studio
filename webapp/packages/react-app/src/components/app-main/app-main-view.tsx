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
import UserRegister from "../page-user/user-register";
import UserLogin from "../page-user/user-login";
import LandingPage from "../page-landing/landing-page";

const AppMainView = () => {
  // This has to be removed from here and we have to use the current project in the redux state
  // const [selectedProjectLocalId, setSelectedProjectLocalId] = useState<string|null>(null);





  return (

      <div>
        App Main View: We should not be here
      </div>
  );

}

export default AppMainView;