import React, { useEffect, useReducer, useState } from "react";
import { useTypedSelector } from "../../hooks/use-typed-selector";
import { useActions } from "../../hooks/use-actions";
import { Link, useNavigate } from "react-router-dom";
import { RoutePath } from "../routes";
import { debugAuth, placeholderEmail } from "../../config/global";
import UserFlowStatus from "./user-flow-status";
import FormField from "./app-user-components/FormField";

interface LoginUser {
  email: string;
  password: string;
}

interface Action {
  type: string;
  payload: any;
}

const reducer = (state: LoginUser, action: Action) => {
  //   switch (action.type) {
  //     case "EMAIL":
  //       return {...state, email: action.payload};
  //     case "PASSWORD":
  //       return {...state, password: action.payload};
  //     default:
  //       return state;
  //   }
  // };

  switch (action.type) {
    case "email":
      return { ...state, email: action.payload };
    case "password":
      return { ...state, password: action.payload };
    default:
      return state;
  }
};

const initialUser: LoginUser = {
  email: "neerajg1320@gmail.com",
  password: "Local123",
};

const blankUser: LoginUser = {
  email: "",
  password: "",
};

const UserLogin = () => {
  const navigate = useNavigate();
  const [user, dispatch] = useReducer(reducer, blankUser);
  const [apiStateDuration, setApiStateDuration] = useState(false);
  const { authenticateUser, resendActivationEmail, passwordResetUser } =
    useActions();
  const isAuthenticated = useTypedSelector<boolean>(
    (state) => state.auth.isAuthenticated
  );
  const apiState = useTypedSelector((state) => state.auth.api);

  useEffect(() => {
    if (isAuthenticated) {
      // console.log(`User login successful`);

      // Created an IIFE (Immediately Invoked Function Expression) for adding delay after success.
      // For debugging purpose
      (async () => {
        await setTimeout(() => {
          navigate(RoutePath.LOGIN_SUCCESS);
        }, 0);
      })();
    }
  }, [isAuthenticated]);

  const handleLoginClick = (e) => {
    e.preventDefault();
    if (debugAuth) {
      console.log(`Login click`);
    }
    if (user.email) {
      authenticateUser(user.email, user.password);
    } else {
      console.error(`Error! currentUser not defined in redux`);
    }
    user.email = "";
    user.password = "";
    setApiStateDuration(true);
    setTimeout(() => {
      setApiStateDuration(false);
    }, 30000);
  };

  const handleInputChange = (actionType: string, actionPayload: string) => {
    dispatch({ type: actionType, payload: actionPayload });
  };

  const handleCancelClick = () => {
    navigate(RoutePath.BACK, { replace: true });
  };

  const handleForgotPasswordClick = () => {
    if (user.email) {
      passwordResetUser(user.email);
    } else {
      window.alert("Please type the email");
    }
  };

  return (
    <div className="form-wrapper">
      <form
        className="form"
        method="POST"
        // onSubmit={handleLogin}
      >
        {/* <div
        className={` text-red-500 text-center font-bold h-[10px] mb-3 gap-2 text-sm flex items-center`}
      >
        {errorMsg.length > 0 && (
          <BsFillExclamationCircleFill color="#EF4444" size="22" />
        )}
        {errorMsg}
        {errorMsg.includes("E-mail is not verified.") && (
          <div className="text underline cursor-pointer" onClick={resendEmail}>Resend Verification E-mail</div>
        )}
      </div> */}
        <FormField
          labelName="Email"
          fieldName="email"
          fieldType="email"
          fieldValue={user.email}
          handleInputChange={handleInputChange}
          // formData={data}
          required={true}
          // setFormData={setData}
        />
        <FormField
          labelName="Password"
          fieldName="password"
          fieldType="password"
          fieldValue={user.password}
          handleInputChange={handleInputChange}
          // formData={data}
          required={true}
          // setFormData={setData}
        />

        <div className="forgot-password" onClick={handleForgotPasswordClick}>
          Forgot Password?
        </div>
        <div className="login-cancel-btn">
          <button
            className="login-btn"
            type="submit"
            onClick={handleLoginClick}
          >
            Login
          </button>
          <button
            className="cancel-btn"
            onClick={() => {
              handleCancelClick();
            }}
          >
            Cancel
          </button>
        </div>
        <div className="text-center">
          Not Registered yet?{" "}
          <Link to={RoutePath.USER_REGISTER} className="cta">
            <span className="not-member-register ">Register</span>
          </Link>
          {apiStateDuration && (
            <UserFlowStatus
              reqMsg="Authenticating User ..."
              email={user.email}
              flowState={apiState}
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default UserLogin;

{
  /* <div style={{
  padding: "20px",
  width: "100%",
  height: "100%",
  display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"
}}
>
  <div className="user-value-list">
    <div className="user-value" style={{display: "flex", marginBottom: "10px"}}>
      <label>Email</label>
      <input
          className="value"
          placeholder={`${placeholderEmail}`}
          type="text" value={user.email}
          onChange={(e) => {dispatch({type: "EMAIL", payload: e.target.value});}}
      />
    </div>
    <div className="user-value" style={{display: "flex"}}>
      <label>Password</label>
      <input
          className="value"
          type="password"
          value={user.password}
          onChange={(e) => {dispatch({type: "PASSWORD", payload: e.target.value});}}
      />
    </div>
    <div className="user-value" style={{display: "flex"}}>
      <label></label>
      <div className="value" style={{fontSize: "0.9em", textAlign: "right"}}>
        <span
            style={{cursor:"pointer", color:"lightblue"}}
            onClick={handleForgotPasswordClick}
        >
          forgot password?
        </span>
      </div>
    </div>

    <div style={{display:"flex", flexDirection:"row", gap:"40px", marginTop: "20px"}}>
      <button
          className="button is-primary is-small"
          onClick={handleLoginClick}
          disabled={!user.email || !user.password}
      >
        Login
      </button>
      <button
          className="button is-family-secondary is-small"
          onClick={() => {handleCancelClick()}}
      >
        Cancel
      </button>
    </div>

    <Link to={RoutePath.USER_REGISTER} replace>
      Not registered yet? <span className="inverse-action">Register</span>
    </Link>

    {/* Status section */
}
//     <UserFlowStatus reqMsg="Authenticating User ..." email={user.email} flowState={apiState} />
//   </div>
// </div> */}
