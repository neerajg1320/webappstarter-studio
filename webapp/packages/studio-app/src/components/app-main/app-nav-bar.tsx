import './app-nav-bar.css';
import {Link, useLocation, useNavigate} from "react-router-dom";
import {RouteDepth, RoutePath} from "../routes";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import {useActions} from "../../hooks/use-actions";
import {debugComponent, serverStaticBaseUrl} from "../../config/global";
import {useState} from "react";

const AppNavBar = () => {
  const enableProjectsList = false;
  const enableUserMenu = false;
  const isAuthenticated = useTypedSelector((state) => state.auth.isAuthenticated);
  const currentUser = useTypedSelector(state => state.auth.currentUser);
  const {logoutUser, deleteUser} = useActions();
  const navigate = useNavigate();
  const location = useLocation();
  const [burgerMenuActive, setBurgerMenuActive] = useState(false);

  const handleLogoutClick = () => {
    if (currentUser) {
      logoutUser(currentUser.localId);
    }

    navigate(RoutePath.ROOT, {replace: true});
  };

  const handleDeleteClick = () => {
    if (currentUser) {
      deleteUser(currentUser.localId);
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

  const handleBurgerClick = () => {
    setBurgerMenuActive((prev) => {
      return !prev;
    });
  }

  return (
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="navbar-item" onClick={handleLogoClick}>
            <div style={{display:"flex", flexDirection:"row", alignItems:"center", gap:"10px"}}>
              <img src={`${serverStaticBaseUrl}/landing/img/react-logo.png`} alt="logo"/>
              <span>WebappStarter</span>
            </div>
          </div>
          <a id="nav-burger" className="navbar-burger" onClick={handleBurgerClick}>
            <span></span>
            <span></span>
            <span></span>
          </a>
        </div>
        <div id="nav-links" className={"navbar-menu " + (burgerMenuActive ? "is-active" : "") }>
          <div className="navbar-end">
            {(isAuthenticated && !currentUser?.is_anonymous) &&
              <div style={{marginLeft: "40px", display: "flex", flexDirection:"row", alignItems:"center"}}>
                <div className={"navbar-item " + (enableProjectsList ? "has-dropdown is-hoverable" : "")}>
                  <div className={enableProjectsList ? "navbar-link" : ""}>
                    <Link className="navbar-item" to={`${RoutePath.PROJECTS}`}>Projects</Link>
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

            {(isAuthenticated && !currentUser?.is_anonymous) &&
              <div className="navbar-item has-dropdown is-hoverable">
                <div className="navbar-link">
                  {currentUser?.first_name}
                </div>

                <div className="navbar-dropdown">
                  {enableUserMenu &&
                    <>
                      <div className="navbar-item">
                        Profile
                      </div>
                      <div className="navbar-item">
                        Messages
                      </div>
                      <div className="navbar-item">
                        Contact info
                      </div>
                    </>
                  }
                  <div className="navbar-item" onClick={() => handleLogoutClick()}>
                    Logout
                  </div>
                  <div className="navbar-item" onClick={() => handleDeleteClick()}>
                    Delete User
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