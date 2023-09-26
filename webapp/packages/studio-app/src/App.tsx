import './App.css';
import {withLifecyleLogger} from './hoc/logger';
import AppRouterWrapper from "./components/app-main/app-router-wrapper";
import {useActions} from "./hooks/use-actions";
import {useEffect} from "react";
import {useTypedSelector} from "./hooks/use-typed-selector";


const App = () => {
  const { initializeBundler } = useActions();
  const projectsLoaded = useTypedSelector(state => state.application.projectsLoaded)
  const bundlerReady = useTypedSelector(state => state.application.bundlerReady)

  useEffect(() => {
    console.log(`App:useEffect[]  projectsLoaded:${projectsLoaded}  bundlerReady:${bundlerReady}`)
    if (projectsLoaded && !bundlerReady) {
      initializeBundler();
    }

  }, [projectsLoaded, bundlerReady]);

  return (
      <AppRouterWrapper />
  );
}

export default withLifecyleLogger(App, false);