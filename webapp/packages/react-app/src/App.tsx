import './App.css';
import React, {useEffect, useMemo, useState} from "react";
import {useActions} from "./hooks/use-actions";
import {useTypedSelector} from "./hooks/use-typed-selector";
import {debugRedux} from "./config/global";
import ProjectMainView from "./components/project-resource/project-main-view";


const App = () => {
  if (debugRedux) {
    console.log(`App: render`);
  }
  const {authenticateUser} = useActions();
  const isAuthenticated = useTypedSelector((state) => state.auth.isAuthenticated)

  // Here we should add use login as well
  const { fetchProjectsAndFiles } = useActions();

  useEffect(() => {
    authenticateUser('neeraj76@yahoo.com', 'Local123');
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjectsAndFiles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return (
    <div style={{
        display:"flex", flexDirection:"column", alignItems: "center", justifyContent: "space-between"
      }}
    >
      <ProjectMainView />
    </div>
  );
}

export default App;