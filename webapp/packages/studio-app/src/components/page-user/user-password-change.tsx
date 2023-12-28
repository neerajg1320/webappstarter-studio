import React, { useReducer, useState } from "react";
import { useActions } from "../../hooks/use-actions";
import { useNavigate, useParams } from "react-router-dom";
import { RoutePath } from "../routes";
import { useTypedSelector } from "../../hooks/use-typed-selector";
import FormField from "../app-components/FormField";
import UserFlowStatus from "./user-flow-status";
import Button from "../app-components/button";
import Loader from "../app-components/loader/loader";

interface UserState {
  id: string;
  taken: string;
  password1: string;
  password2: string;
  old_password: string;
}

interface UserAction {
  type: string;
  payload: any;
}

type Reducer = (ResetPasswordUser, Action) => UserState;

const reducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case "new_Password1":
      return { ...state, password1: action.payload };
    case "new_Password2":
      return { ...state, password2: action.payload };
    case "old_Password":
      return { ...state, old_password: action.payload };

    default:
      return state;
  }
};

interface UserPasswordChangeProps {
  resetConfirm: boolean;
}

const UserPasswordChange: React.FC<UserPasswordChangeProps> = ({
  resetConfirm = true,
}) => {
  const [user, dispatch] = useReducer(reducer, {} as UserState);
  const [apiStateDuration, setApiStateDuration] = useState(false);
  // const key = "MjM:1qUKq0:M87nAd1mq9mV_ly2rNLN1sxoYFEHUQfh00YrhIRuqFA";
  const navigate = useNavigate();
  const { passwordResetConfirmUser, passwordChange } = useActions();
  const { uid, token } = useParams();
  const apiState = useTypedSelector((state) => state.auth.api);

  console.log(`UserActivate:render uid=${uid} token=${token}`);

  const handleSetClick = (e) => {
    e.preventDefault();
    if (resetConfirm) {
      if (uid && token) {
        passwordResetConfirmUser(uid, token, user.password1, user.password2);
        navigate(RoutePath.USER_LOGIN, { replace: true });
      } else {
        console.error(`Error! uid and token are required`);
      }
    } else {
      passwordChange(user.password1, user.password2, user.old_password);
      user.old_password = "";
      user.password1 = "";
      user.password2 = "";
    }

    setApiStateDuration(true);
    setTimeout(() => {
      setApiStateDuration(false);
    }, 30000);
  };

  const handleCancelClick = () => {
    navigate(RoutePath.BACK);
  };

  const handleLoginClick = () => {
    navigate(RoutePath.USER_LOGIN, { replace: true });
  };

  const handleInputChange = (actionType: string, actionPayload: string) => {
    dispatch({ type: actionType, payload: actionPayload });
  };

  console.log(user);

  if (apiState.requestStarted) {
    return <Loader size={5} width={0.4} />;
  }

  return (
    <div className="form-wrapper">
      <form
        className="form"
        method="POST"
        // onSubmit={handleFormSubmit}
      >
        {!resetConfirm && (
          <FormField
            fieldName="old_Password"
            fieldType="password"
            required={true}
            labelName="Old Password"
            fieldValue={user.old_password}
            handleInputChange={handleInputChange}
          />
        )}
        <FormField
          fieldName="new_Password1"
          fieldType="password"
          required={true}
          labelName="New Password"
          fieldValue={user.password1}
          handleInputChange={handleInputChange}
          // formData={resetPasswordData}
          // setFormData={setResetPasswordData}
        />
        <FormField
          fieldName="new_Password2"
          fieldType="password"
          required={true}
          labelName="Confirm New Password"
          fieldValue={user.password2}
          handleInputChange={handleInputChange}
          // formData={resetPasswordData}
          // setFormData={setResetPasswordData}
        />
        <div className="form-submit-cancel-btn">
          <Button
            buttonClass="form-submit-btn"
            title="Set"
            buttonType="submit"
            handleButtonClick={handleSetClick}
          />
          <Button
            buttonClass="cancel-btn"
            handleButtonClick={handleCancelClick}
            buttonType="button"
            title="Cancel"
          />
        </div>
        {apiStateDuration && (
          <UserFlowStatus
            reqMsg="Authenticating User ..."
            email=""
            flowState={apiState}
          />
        )}
      </form>
    </div>
  );
};

export default UserPasswordChange;

{
  /* <div style={{
  padding: "20px",
  width: "100%",
  height: "100%",
  display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"
}}
>
  <span className="title">{resetConfirm ? "Reset Password" : "Change Password"}</span>
  <div className="user-value-list">
    <div className="user-value" style={{display: "flex"}}>
      <label>Password</label>
      <input
          className="value"
          type="password"
          value={user.password1}
          onChange={(e) => {dispatch({type: "PASSWORD1", payload: e.target.value});}}
      />
    </div>
    <div className="user-value" style={{display: "flex"}}>
      <label>Confirm</label>
      <input
          className="value"
          type="password"
          value={user.password2}
          onChange={(e) => {dispatch({type: "PASSWORD2", payload: e.target.value});}}
      />
    </div>


    <div style={{display:"flex", flexDirection:"row", gap:"40px", marginTop: "40px"}}>

      <>
        <button
            className="button is-primary is-small"
            onClick={handleSetClick}
        >
          Set
        </button>
        <button
        className="button is-family-secondary is-small"
        onClick={() => {handleCancelClick()}}
        >
        Cancel
        </button>
      </>

    </div>

    <UserFlowStatus reqMsg="Resetting Password ..." email="" flowState={apiState} />
  </div>
</div> */
}
