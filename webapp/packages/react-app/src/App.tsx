import './App.css';
import {ProjectCreate} from "./components/project-resource/project-create";
import React, {useEffect, useMemo, useState} from "react";
import {useActions} from "./hooks/use-actions";
import {useTypedSelector} from "./hooks/use-typed-selector";
import ProjectCell from "./components/project-cell/project-cell";
import Select, {SingleValue} from "react-select";
import {ReduxProject} from "./state";
import {debugRedux} from "./config/global";
import MainView from "./components/main-view/main-view";

const App = () => {
  if (debugRedux) {
    console.log(`App: render`);
  }

  // Here we should add use login as well
  const { fetchProjectsAndFiles } = useActions();

  useEffect(() => {
    fetchProjectsAndFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  return (
    <div style={{display:"flex", flexDirection:"column", alignItems: "center"}}>
      <MainView />
    </div>
  );
}

export default App;