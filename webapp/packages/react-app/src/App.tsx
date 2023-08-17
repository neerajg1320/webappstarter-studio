import './App.css';
import React, {useEffect} from "react";
import {useActions} from "./hooks/use-actions";
import {useTypedSelector} from "./hooks/use-typed-selector";
import {authOnAppStart, debugComponent} from "./config/global";

import AppRouterWrapper from "./components/app-main/app-router-wrapper";


const App = () => {
  if (debugComponent) {
    console.log(`App: render`);
  }

  const {authenticateUser} = useActions();
  
  useEffect(() => {
    if (debugComponent) {
      console.log('App: first render');
    }

    if (authOnAppStart) {
      authenticateUser('neeraj76@yahoo.com', 'Local123');
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

export default App;