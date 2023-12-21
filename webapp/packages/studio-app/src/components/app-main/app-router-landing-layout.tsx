import './app-router-landing-layout.css';
import {Outlet, useLocation} from "react-router-dom";
import AppNavBar from "./app-nav-bar";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import {RoutePath} from "../routes";
import {debugComponent} from "../../config/global";

const AppRouterLandingLayout = () => {
  const location = useLocation();
  const isAuthenticated = useTypedSelector<boolean>(state => state.auth.isAuthenticated);

  if (debugComponent) {
    console.log(`location: ${JSON.stringify(location)}`);
  }

  return (
      <div className="landing-page">
        {/* {(location.pathname !== RoutePath.ROOT) && <AppNavBar />} */}
        <AppNavBar />
        <div className="outlet">
          <Outlet />
        </div>
      </div>
  );
}

export default AppRouterLandingLayout;