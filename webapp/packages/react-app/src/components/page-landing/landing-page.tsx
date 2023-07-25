import './landing-page.css';

const LandingPage = () => {
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
            <button className="button is-primary">Register</button>
            <button className="button">Login</button>
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
