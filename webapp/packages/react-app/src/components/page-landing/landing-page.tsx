import './landing-page.css';
import {useNavigate} from "react-router-dom";
import {RouteName} from "../routes";
import {debugComponent} from "../../config/global";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    if (debugComponent) {
      console.log(`handleRegisterClick()`);
    }

    navigate(RouteName.USER_REGISTER);
  }

  const handleLoginClick = () => {
    if (debugComponent) {
      console.log(`handleLoginClick()`);
    }
    navigate(RouteName.USER_LOGIN);
  }

  return (
    <div className="landing-wrapper">
      <div className="left-side">
        <div className="brand-bar">
          <img className="logo-image" src="http://localhost:8080/staticfiles/landing/img/react-logo.png" alt="Logo-Image"/>
          <div className="logo-text">
            React Morph
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
          <img className="main-image" src="http://localhost:8080/staticfiles/landing/img/generic-browser-logo.png" alt="Main-Image"/>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
