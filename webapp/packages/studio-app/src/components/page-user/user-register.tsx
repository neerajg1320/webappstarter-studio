import './user.css';
import React, {useEffect, useMemo, useReducer} from "react";
import {useActions} from "../../hooks/use-actions";
import {Link, useNavigate} from "react-router-dom";
import {RoutePath} from "../routes";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import {placeholderEmail} from "../../config/global";
import UserFlowStatus from "./user-flow-status";

interface RegisterUser {
  email: string;
  password1: string;
  password2: string;
  first_name: string;
  last_name: string;
};

interface Action {
  type: string,
  payload: any
}

const reducer = (state:RegisterUser, action: Action) => {
  switch (action.type) {
    case "EMAIL":
      return {...state, email: action.payload};
    case "PASSWORD1":
      return {...state, password1: action.payload};
    case "PASSWORD2":
      return {...state, password2: action.payload};
    case "FIRST_NAME":
      return {...state, first_name: action.payload};
    case "LAST_NAME":
      return {...state, last_name: action.payload};

    default:
      return state;
  }
};

const initialUser:RegisterUser = {
  email: 'neerajg1320@gmail.com',
  password1: 'Local123',
  password2: 'Local123',
  first_name: 'Neeraj',
  last_name: 'Gupta'
}

const blankUser:RegisterUser = {
  email: '',
  password1: '',
  password2: '',
  first_name: '',
  last_name: ''
}

const UserRegister = () => {
  const navigate = useNavigate();
  const [user, dispatch] = useReducer(reducer, blankUser);
  const { registerUser } = useActions();
  // const registerState = useTypedSelector(state => state.auth.register);
  const apiState = useTypedSelector(state => state.auth.api);

  useEffect(() => {
   console.log(`UserRegister:useState[]`);

   return () => {
     console.log(`UserRegister:destroyed`);
   }
  }, []);

  // useEffect(() => {
  //   console.log(`UserRegister:render registerState:`, registerState);
  // }, [registerState]);

  const handleRegisterClick = () => {
    if (user.email) {
      registerUser(user.email, user.password1, user.password2, user.first_name, user.last_name)
    } else {
      console.error(`Error! currentUser not defined in redux`);
    }
  }

  const handleCancelClick = () => {
    navigate(RoutePath.BACK, {replace:true});
  }

  return (
      <div className="user-value-wrapper" style={{
        padding: "20px",
        width: "100%",
        height: "100%",
        display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "40px"
      }}
      >
        <div className="user-value-list">
          <div className="user-value" style={{display: "flex"}}>
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
          <div className="user-value" style={{display: "flex"}}>
            <label>First Name</label>
            <input
                className="value"
                placeholder="First Name"
                type="text" value={user.first_name}
                onChange={(e) => {dispatch({type: "FIRST_NAME", payload: e.target.value});}}
            />
          </div>
          <div className="user-value" style={{display: "flex"}}>
            <label>Last Name</label>
            <input
                className="value"
                placeholder="Last Name"
                type="text" value={user.last_name}
                onChange={(e) => {dispatch({type: "LAST_NAME", payload: e.target.value});}}
            />
          </div>

          <div style={{display:"flex", flexDirection:"row", gap:"40px"}}>
            <button
                className="button is-primary is-small"
                onClick={handleRegisterClick}
                disabled={!user.email || !user.password1 || !user.password2}
            >
              Register
            </button>
            <button
                className="button is-family-secondary is-small"
                onClick={() => {handleCancelClick()}}
            >
              Cancel
            </button>
          </div>

          <Link to={RoutePath.USER_LOGIN} replace>
            Already registered? <span className="inverse-action">Login</span>
          </Link>

          <UserFlowStatus reqMsg="Registering User ..." email={user.email} flowState={apiState} />
        </div>
      </div>
  );
}

export default UserRegister;