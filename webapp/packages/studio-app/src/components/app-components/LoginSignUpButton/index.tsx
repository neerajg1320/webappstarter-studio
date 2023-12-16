import React from "react";
import { Link } from "react-router-dom";
import Button from "../button";
import { RoutePath } from "../../routes";

const LoginSignup = () => {
  return (
    <div className={`loginSignupButtons `}>
      <Link to={RoutePath.USER_LOGIN}>
        <Button title="Login" buttonClass="loginButton" buttonType="button" />
      </Link>
      <Link to={RoutePath.USER_REGISTER}>
        <Button
          title="Sign Up"
          buttonClass="signupButton"
          buttonType="button"
        />
      </Link>
    </div>
  );
};

export default LoginSignup;
