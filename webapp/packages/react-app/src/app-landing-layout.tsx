import './app-landing-layout.css';
import {Outlet} from "react-router-dom";
import AppNavBar from "./components/app-main/app-nav-bar";

const AppLandingLayout = () => {
  return (
      <div className="landing-page">
        <AppNavBar />
        <Outlet />
      </div>
  );
}

export default AppLandingLayout;