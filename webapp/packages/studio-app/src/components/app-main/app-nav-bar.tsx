import "./app-nav-bar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RouteDepth, RoutePath } from "../routes";
import { useTypedSelector } from "../../hooks/use-typed-selector";
import { useActions } from "../../hooks/use-actions";
import {
  debugComponent,
  serverStaticBaseUrl,
  faqUrl,
  teamUrl,
} from "../../config/global";
import { useState } from "react";
import { FaBarsStaggered } from "react-icons/fa6";
import Button from "./app-nav-bar-components/Button/index";
import { FaUserCircle } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io"

const AppNavBar = () => {
  const enableProjectsList = false;
  const enableUserMenu = false;
  const isAuthenticated = useTypedSelector(
    (state) => state.auth.isAuthenticated
  );
  const currentUser = useTypedSelector((state) => state.auth.currentUser);
  const { logoutUser, deleteUser } = useActions();
  const navigate = useNavigate();
  const location = useLocation();
  const [burgerMenuActive, setBurgerMenuActive] = useState(false);
  const [isProfileDropDown, setIsProfileDropDown] = useState(false);

  const handleLogoutClick = () => {
    if (currentUser) {
      logoutUser(currentUser.localId);
    }

    navigate(RoutePath.ROOT, { replace: true });
  };

  const handleDeleteClick = () => {
    const choice = window.confirm(
      "Are you sure you want to delete your account? You will lose all the projects."
    );
    console.log(`choice:`, choice);

    if (choice) {
      if (currentUser) {
        console.log(`User account delete called`);
        deleteUser(currentUser.localId);
      }
      navigate(RoutePath.ROOT, { replace: true });
    }
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
  };

  const handleLogoClick = () => {
    navigate(RoutePath.ROOT, { replace: true });
  };

  const handlePasswordChangeClick = () => {
    navigate(RoutePath.USER_PASSWORD_CHANGE, { replace: true });
  };

  const [isToggleMenu, setIsToggleMenu] = useState(false);

  const handleToggleClick = () => {
    setIsToggleMenu(!isToggleMenu);
  };

  const handleProfileClick = () => {
    setIsProfileDropDown( !isProfileDropDown);
  };


  // console.log("isAuthenticated: ", isAuthenticated);
  // console.log("currentUser: ", currentUser);

  return (
    <>
      <div className="navbar">
        <div className="logoMenu">
          <div className="menu" onClick={handleToggleClick}>
            <FaBarsStaggered />
          </div>
          <Link className="logo" to="/">
            WEBAPP STARTER
          </Link>
        </div>

        <ul className={`list  ${isToggleMenu ? " " : "moveLeft"}`}>
          <li className="listItem">
            <a className="navItem" href={`${RoutePath.PROJECT_PLAYGROUND}`}>
              Playground
            </a>
          </li>
          {/* <li className={styles.listItem}>
        <a className={styles.navItem} href={`${urlStudio}`}>
          Studio
        </a>
      </li> */}
          <li className="listItem">
            <Link className="navItem" to={faqUrl}>
              FAQ
            </Link>
          </li>
          <li className="listItem">
            <Link className="navItem" to={teamUrl}>
              Team
            </Link>
          </li>
        </ul>

        {!isAuthenticated && !currentUser?.is_anonymous ? (
          <div className={`loginSignupButtons `}>
            <Link to={RoutePath.USER_LOGIN}>
              <Button title="Login" buttonClass="loginButton" />
            </Link>
            <Link to={RoutePath.USER_REGISTER}>
              <Button title="Sign Up" buttonClass="signupButton" />
            </Link>
          </div>
        ) : (
          <div className="login-profile" onClick={handleProfileClick} >
            <div className="profile">
            <span>{currentUser?.first_name}</span>
            <FaUserCircle size="23"/>
            </div>
            <IoIosArrowDown size="15"/>
          </div>
        )}
      </div>
      {isProfileDropDown && <ul className="profile-over-dropdown" >
        <li onClick={() => handlePasswordChangeClick()}>
          Change Password
        </li>
        <li onClick={() => handleLogoutClick()}>
          Logout
        </li>
        </ul>}
    </>
  );
};

export default AppNavBar;

{
  /* <nav className="navbar ">
<div className='navbar-brand flex items-center'>
  <img src={`${serverStaticBaseUrl}/landing/img/react-logo.png`} alt="logo" className='nav-logo'/>
  <span>WebappStarter</span>
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
      <div className="navbar-item" onClick={() => handlePasswordChangeClick()}>
        Change Password
      </div>
      {/*
        <div className="navbar-item" onClick={() => handleDeleteClick()}>
          Delete Account
        </div>
      */
}
//       <div className="navbar-item" onClick={() => handleLogoutClick()}>
//         Logout
//       </div>
//     </div>
//   </div>
// }
// </div>
// </div>
// </nav> */}
