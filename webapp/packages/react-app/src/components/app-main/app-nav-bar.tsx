import './app-nav-bar.css';
import {Link, useLocation, useNavigate} from "react-router-dom";
import {RouteDepth, RoutePath} from "../routes";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import {useActions} from "../../hooks/use-actions";
import {debugComponent} from "../../config/global";

const AppNavBar = () => {
  const isAuthenticated = useTypedSelector((state) => state.auth.isAuthenticated);
  const currentUser = useTypedSelector(state => state.auth.currentUser);
  const {logoutUser} = useActions();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoutClick = () => {
    logoutUser();
    navigate(RoutePath.ROOT);
  };

  const handleLoginClick = () => {
    navigate(RoutePath.USER_LOGIN);
  }

  const handleRegisterClick = () => {
    navigate(RoutePath.USER_REGISTER);
  }

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

  return (
      <nav className="navbar">
        <div  className="navbar-menu">

          <div className="navbar-start">
            {
                isAuthenticated &&
                <>
                  <div className="navbar-item has-dropdown is-hoverable">
                    <div className="navbar-link">
                      <Link to="/">Projects</Link>
                    </div>

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
                  </div>
                  <div className="navbar-item" onClick={handleBackClick}>
                      Close
                  </div>
                </>
            }

          </div>

          <div className="navbar-end">
            {isAuthenticated ?
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
                :
                <div className="navbar-item">
                  {/*<div>*/}
                  {/*  <div className="button is-family-secondary" onClick={() => handleLoginClick()}>*/}
                  {/*    <strong>Login</strong>*/}
                  {/*  </div>*/}
                  {/*  <div className="button is-primary" onClick={() => handleRegisterClick()}>*/}
                  {/*    <strong>Sign up</strong>*/}
                  {/*  </div>*/}
                  {/*</div>*/}
                </div>
            }
          </div>
        </div>
      </nav>
  );
}

export default AppNavBar;