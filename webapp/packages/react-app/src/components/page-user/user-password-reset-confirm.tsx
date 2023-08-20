import React, {useReducer} from "react";
import {useActions} from "../../hooks/use-actions";
import {useNavigate, useParams} from "react-router-dom";
import {RoutePath} from "../routes";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import UserFlowStatus from "./user-flow-status";

interface ResetPasswordUser {
  id: string;
  taken: string;
  password1: string;
  password2: string;
};

interface Action {
  type: string,
  payload: any
}

const reducer = (state:ResetPasswordUser, action: Action) => {
  switch (action.type) {

    case "PASSWORD1":
      return {...state, password1: action.payload};
    case "PASSWORD2":
      return {...state, password2: action.payload};

    default:
      return state;
  }
};


const UserActivate = () => {
  const [user, dispatch] = useReducer(reducer, {} as ResetPasswordUser);
  // const key = "MjM:1qUKq0:M87nAd1mq9mV_ly2rNLN1sxoYFEHUQfh00YrhIRuqFA";
  const navigate = useNavigate();
  const { passwordResetConfirmUser } = useActions();
  const { uid, token } = useParams();
  const apiState = useTypedSelector(state => state.auth.api);

  console.log(`UserActivate:render uid=${uid} token=${token}`);

  const handleSetClick = () => {
    if (uid && token) {
      passwordResetConfirmUser(uid, token, user.password1, user.password2);
    } else {
      console.error(`Error! uid and token are required`);
    }
  }

  const handleCancelClick = () => {
    navigate(RoutePath.BACK);
  }

  const handleLoginClick = () => {
    navigate(RoutePath.USER_LOGIN, {replace:true});
  }

  return (
      <div style={{
        padding: "20px",
        width: "100%",
        height: "100%",
        display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"
      }}
      >
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
      </div>
  );
}

export default UserActivate;