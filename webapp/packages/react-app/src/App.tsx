import './App.css';
import React, {useEffect, useMemo, useState} from "react";
import {useActions} from "./hooks/use-actions";
import {useTypedSelector} from "./hooks/use-typed-selector";
import {autoAuthenticateUser, debugRedux} from "./config/global";
import AppMainView from "./components/app-main/app-main-view";
import LandingPage from "./components/page-landing/landing-page";


const App = () => {
  if (debugRedux) {
    console.log(`App: render`);
  }
  const {authenticateUser} = useActions();
  const isAuthenticated = useTypedSelector((state) => state.auth.isAuthenticated)

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

  return (
    <div style={{
        width: "100%",
        display:"flex", flexDirection:"column", alignItems: "center", justifyContent: "center"
      }}
    >
      {isAuthenticated ?
          <AppMainView />
        :
          <LandingPage />
      }
    </div>
  );
}

export default App;