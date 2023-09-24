import './App.css';
import {withLifecyleLogger} from './hoc/logger';
import AppRouterWrapper from "./components/app-main/app-router-wrapper";


const App = () => {

  return (
      <AppRouterWrapper />
  );
}

export default withLifecyleLogger(App, false);