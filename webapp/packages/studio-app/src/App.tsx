import './App.css';
import {withLifecyleLogger} from './hoc/logger';
import AppRouterWrapper from "./components/app-main/app-router-wrapper";
import {useActions} from "./hooks/use-actions";
import {useEffect} from "react";
import {useTypedSelector} from "./hooks/use-typed-selector";
import {debugComponent} from "./config/global";


const App = () => {
  const debugComponent = false;
  const { initializeBundler } = useActions();
  const isAuthenticated = useTypedSelector(state => state.auth.isAuthenticated);
  const currentUser = useTypedSelector(state => state.auth.currentUser);
  const projectsLoaded = useTypedSelector(state => state.application.projectsLoaded)
  const bundlerReady = useTypedSelector(state => state.application.bundlerReady)

  useEffect(() => {
    if (debugComponent) {
      console.log(`App:useEffect[]  isAuthenticated:${isAuthenticated} projectsLoaded:${projectsLoaded}  bundlerReady:${bundlerReady} currentUser:`, currentUser);
    }

    if (!isAuthenticated) {
      return;
    }

    if (!currentUser.is_anonymous) {
      if (!projectsLoaded) {
        return;
      }
    }

    if (bundlerReady) {
      return;
    }

    initializeBundler();
  }, [isAuthenticated, currentUser, projectsLoaded, bundlerReady]);

  return (
      <AppRouterWrapper />
  );
}

export default withLifecyleLogger(App, false);