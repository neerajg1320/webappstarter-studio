import './landing-page.css';
import {useNavigate} from "react-router-dom";
import {RoutePath} from "../routes";
import {debugComponent, serverStaticBaseUrl} from "../../config/global";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import {useEffect} from "react";

const LandingPage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useTypedSelector(state => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(RoutePath.PROJECTS, {replace:true});
    }
  }, [isAuthenticated]);

  const handleRegisterClick = () => {
    if (debugComponent) {
      console.log(`handleRegisterClick()`);
    }

    navigate(RoutePath.USER_REGISTER);
  }

  const handleLoginClick = () => {
    if (debugComponent) {
      console.log(`handleLoginClick()`);
    }
    navigate(RoutePath.USER_LOGIN);
  }

  return (
    <div className="landing-wrapper">
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
    </div>
  );
}

export default LandingPage;
