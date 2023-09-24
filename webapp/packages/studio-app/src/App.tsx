import './App.css';
import React, {useEffect} from "react";
import {useActions} from "./hooks/use-actions";
import {authOnAppStart, debugComponent} from "./config/global";
import {withLifecyleLogger} from './hoc/logger';

import AppRouterWrapper from "./components/app-main/app-router-wrapper";


const App = () => {
  const debugComponent = true;

  if (debugComponent) {
    console.log(`App: render`);
  }

  const {authenticateUserFromLocalStorage} = useActions();

  useEffect(() => {
    if (debugComponent) {
      console.log('App: first render');
    }

    if (authOnAppStart) {
      authenticateUserFromLocalStorage();
    }

    return () => {
      if (debugComponent) {
        console.log('App: destroyed');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
      <AppRouterWrapper />
  );
}

export default withLifecyleLogger(App);