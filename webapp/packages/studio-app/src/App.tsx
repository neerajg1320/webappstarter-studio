import './App.css';
import React, {useEffect} from "react";
import {useActions} from "./hooks/use-actions";
import {authOnAppStart} from "./config/global";
import {withLifecyleLogger} from './hoc/logger';

import AppRouterWrapper from "./components/app-main/app-router-wrapper";


const App = () => {
  const {authenticateUserFromLocalStorage} = useActions();

  useEffect(() => {
    if (authOnAppStart) {
      authenticateUserFromLocalStorage();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
      <AppRouterWrapper />
  );
}

export default withLifecyleLogger(App, false);