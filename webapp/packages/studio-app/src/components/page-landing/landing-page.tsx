import "./landing-page.css";
import { useNavigate } from "react-router-dom";
import { RoutePath } from "../routes";
import { debugComponent, serverStaticBaseUrl } from "../../config/global";
import { useTypedSelector } from "../../hooks/use-typed-selector";
import { useEffect } from "react";
import Typewriter from "./Typewriter";
import LoginSignup from "../app-components/LoginSignUpButton";

const LandingPage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useTypedSelector(
    (state) => state.auth.isAuthenticated
  );
  const currentUser = useTypedSelector((state) => state.auth.currentUser);

  useEffect(() => {
    if (isAuthenticated && !currentUser?.is_anonymous) {
      navigate(RoutePath.PROJECTS, { replace: true });
    }
  }, [isAuthenticated]);

  const handleRegisterClick = () => {
    if (debugComponent) {
      console.log(`handleRegisterClick()`);
    }

    navigate(RoutePath.USER_REGISTER);
  };

  const handleLoginClick = () => {
    if (debugComponent) {
      console.log(`handleLoginClick()`);
    }
    navigate(RoutePath.USER_LOGIN);
  };

  const reactCode = [
    `import React from "react"`,
    "const App = ()=>{",
    "  return(",
    "    <>",
    "      Hello ✌, Friends",
    "      <button>",
    "        I'm a button",
    "      </button>",
    `    </>`,
    ")}",
  ];

  return (
    <div className="landing-page-studio">
      <div className="brand-logo">
        <h1>WebappStarter</h1>
      </div>
      <div className="middle-section">
        {/* <div> */}
        <div className="middle-section-left">
          <p>Reactjs IDE on your browser</p>
          <div className="login-signup-desktop">
            <LoginSignup />
          </div>
        </div>
        {/* </div> */}

        <Typewriter text={reactCode} boxClass={"reactCode"} />
        <div className="login-signup-mobile">
          <LoginSignup />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

{
  /* <div className="landing-wrapper">
      <div className="left-side">
        <div className="brand-bar">
          <img className="logo-image" src={`${serverStaticBaseUrl}/landing/img/react-logo.png`} alt="Logo-Image"/>
          <div className="logo-text">
            WebappStarter Studio
          </div>
        </div>
        <div className="main-content">
          <div className="description-text">
            Reactjs IDE on your browser
          </div>
          <div className="auth-section-bar">
            <button className="button is-primary" onClick={handleRegisterClick}>
              Register
            </button>
            <button className="button" onClick={handleLoginClick}>
              Login
            </button>
          </div>
        </div>
      </div>
      <div className="right-side">
        <div className="main-image-wrapper">
          <img className="main-image" src={`${serverStaticBaseUrl}/landing/img/generic-browser-logo.png`} alt="Main-Image"/>
        </div>
      </div>
    </div> */
}
