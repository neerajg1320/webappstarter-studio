import './app-landing-layout.css';
import {Outlet, useLocation} from "react-router-dom";
import AppNavBar from "./components/app-main/app-nav-bar";
import {useTypedSelector} from "./hooks/use-typed-selector";

const AppLandingLayout = () => {
  const location = useLocation();
  const isAuthenticated = useTypedSelector<boolean>(state => state.auth.isAuthenticated);

  console.log(`location: ${JSON.stringify(location)}`);

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