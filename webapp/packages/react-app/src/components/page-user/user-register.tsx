import './user.css';
import React, {useReducer} from "react";
import {useActions} from "../../hooks/use-actions";
import {useNavigate} from "react-router-dom";
import {RoutePath} from "../routes";

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
  email: 'neeraj76@yahoo.com',
  password1: 'Local123',
  password2: 'Local123',
  first_name: 'Neeraj',
  last_name: 'Gupta'
}

const UserRegister = () => {
  const navigate = useNavigate();
  const [user, dispatch] = useReducer(reducer, initialUser);
  const { registerUser } = useActions();

  const handleRegisterClick = () => {
    if (user.email) {
      registerUser(user.email, user.password1, user.password2, user.first_name, user.last_name);
    } else {
      console.error(`Error! currentUser not defined in redux`);
    }
  }

  const handleCancelClick = () => {
    navigate(RoutePath.BACK);
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
                type="text" value={user.email}
                onChange={(e) => {dispatch({type: "EMAIL", payload: e.target.value});}}
            />
          </div>
          <div className="user-value" style={{display: "flex"}}>
            <label>Password</label>
            <input
                className="value"
                value={user.password1}
                onChange={(e) => {dispatch({type: "PASSWORD1", payload: e.target.value});}}
            />
          </div>
          <div className="user-value" style={{display: "flex"}}>
            <label>Confirm Password</label>
            <input
                className="value"
                value={user.password2}
                onChange={(e) => {dispatch({type: "PASSWORD2", payload: e.target.value});}}
            />
          </div>
          <div className="user-value" style={{display: "flex"}}>
            <label>First Name</label>
            <input
                className="value"
                type="text" value={user.first_name}
                onChange={(e) => {dispatch({type: "FIRST_NAME", payload: e.target.value});}}
            />
          </div>
          <div className="user-value" style={{display: "flex"}}>
            <label>Last Name</label>
            <input
                className="value"
                type="text" value={user.last_name}
                onChange={(e) => {dispatch({type: "LAST_NAME", payload: e.target.value});}}
            />
          </div>

          <div style={{display:"flex", flexDirection:"row", gap:"40px", marginTop:"40px"}}>
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
        </div>

      </div>
  );
}

export default UserRegister;