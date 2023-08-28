import './app-nav-bar.css';
import {Link, useLocation, useNavigate} from "react-router-dom";
import {RouteDepth, RoutePath} from "../routes";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import {useActions} from "../../hooks/use-actions";
import {debugComponent} from "../../config/global";

const AppNavBar = () => {
  const enableProjectsList = false;
  const isAuthenticated = useTypedSelector((state) => state.auth.isAuthenticated);
  const currentUser = useTypedSelector(state => state.auth.currentUser);
  const {logoutUser} = useActions();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoutClick = () => {
    if (currentUser) {
      logoutUser(currentUser.localId);
    }

    navigate(RoutePath.ROOT, {replace: true});
  };

  const handleBackClick = () => {
    if (debugComponent) {
      console.log(`location: `, location);
    }

    if (location.pathname === RoutePath.PROJECT_CELL) {
      navigate(RouteDepth.ONE_UP);
    } else {
      navigate(RoutePath.BACK);
    }
  }

  const handleLogoClick = () => {
    navigate(RoutePath.ROOT, {replace: true});
  }

  return (
      <nav className="navbar">
        <div  className="navbar-menu">
          <div className="navbar-start">
            <div className="navbar-item" onClick={handleLogoClick}>
              <div style={{display:"flex", flexDirection:"row", alignItems:"center", gap:"10px"}}>
                <img src="/logo192.png" alt="logo"/>
                <span>WebappStarter</span>
              </div>
            </div>
            {isAuthenticated &&
              <div style={{marginLeft: "40px", display: "flex", flexDirection:"row", alignItems:"center"}}>
                <div className={"navbar-item " + (enableProjectsList ? "has-dropdown is-hoverable" : "")}>
                  <div className={enableProjectsList ? "navbar-link" : ""}>
                    <Link className="navbar-item" to="/">Projects</Link>
                  </div>

                  {enableProjectsList &&
                    <div className="navbar-dropdown">
                      <div className="navbar-item">
                        Project 1
                      </div>
                      <div className="navbar-item">
                        Project 2
                      </div>
                      <div className="navbar-item">
                        Project 3
                      </div>
                    </div>
                  }
                </div>
              </div>
            }
          </div>

          <div className="navbar-end">
            {isAuthenticated &&
              <div className="navbar-item has-dropdown is-hoverable">
                <div className="navbar-link">
                  {currentUser?.first_name}
                </div>

                <div className="navbar-dropdown">
                  <div className="navbar-item">
                    Profile
                  </div>
                  <div className="navbar-item">
                    Messages
                  </div>
                  <div className="navbar-item">
                    Contact info
                  </div>
                  <div className="navbar-item" onClick={() => handleLogoutClick()}>
                    Logout
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </nav>
  );
}

export default AppNavBar;