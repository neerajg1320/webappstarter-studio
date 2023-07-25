import './app-landing-layout.css';
import {Outlet} from "react-router-dom";
import AppNavBar from "./components/app-main/app-nav-bar";
import {useTypedSelector} from "./hooks/use-typed-selector";

const AppLandingLayout = () => {
  const isAuthenticated = useTypedSelector<boolean>(state => state.auth.isAuthenticated);

  return (
      <div className="landing-page">
        {isAuthenticated && <AppNavBar />}
        <div className="outlet">
          <Outlet />
        </div>
      </div>
  );
}

export default AppLandingLayout;