import './app-landing-layout.css';
import {Outlet, useLocation} from "react-router-dom";
import AppNavBar from "./components/app-main/app-nav-bar";
import {useTypedSelector} from "./hooks/use-typed-selector";
import {RoutePath} from "./components/routes";
import {debugComponent} from "./config/global";

const AppLandingLayout = () => {
  const location = useLocation();
  const isAuthenticated = useTypedSelector<boolean>(state => state.auth.isAuthenticated);

  if (debugComponent) {
    console.log(`location: ${JSON.stringify(location)}`);
  }

  return (
      <div className="landing-page">
        {(isAuthenticated && location.pathname !== RoutePath.ROOT) && <AppNavBar />}
        <div className="outlet">
          <Outlet />
        </div>
      </div>
  );
}

export default AppLandingLayout;