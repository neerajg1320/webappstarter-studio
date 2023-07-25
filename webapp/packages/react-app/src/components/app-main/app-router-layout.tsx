import './app-router-layout.css';
import {Outlet, Link, useNavigate} from "react-router-dom";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import {useActions} from "../../hooks/use-actions";
import {RouteName} from "../routes";

const AppRouterLayout = () => {
  const showEditorNavItem = false;
  const isAuthenticated = useTypedSelector((state) => state.auth.isAuthenticated);
  const {logoutUser} = useActions();
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    logoutUser();
    navigate(RouteName.DASHBOARD);
  };

  return (
      <div style={{
          height: "80vh",
          width:"100%", padding:"0 40px",
          display: "flex", flexDirection:"column", gap:"20px"
        }}
      >
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
                  <div className="navbar-item" >
                    <Link to={RouteName.BACK}>Close </Link>
                  </div>
                </>
              }

            </div>

            <div className="navbar-end">
              {isAuthenticated ?
                  <div className="navbar-item has-dropdown is-hoverable">
                    <div className="navbar-link">
                      User
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
                    <div>
                      <div className="button is-family-secondary">
                        <strong>Login</strong>
                      </div>
                      <div className="button is-primary">
                        <strong>Sign up</strong>
                      </div>
                    </div>
                  </div>
              }
            </div>
          </div>
        </nav>

        <div className="outlet app-router-view">
          <Outlet />
        </div>

      </div>
  )
};

export default AppRouterLayout;