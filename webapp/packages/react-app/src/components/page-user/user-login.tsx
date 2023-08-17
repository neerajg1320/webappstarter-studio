import React, {useEffect, useReducer} from "react";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import {useActions} from "../../hooks/use-actions";
import {Link, useNavigate} from "react-router-dom";
import {RoutePath} from "../routes";
import {debugAuth, placeholderEmail} from "../../config/global";

interface LoginUser {
  email: string;
  password: string;
};

interface Action {
  type: string,
  payload: any
}

const reducer = (state:LoginUser, action: Action) => {
  switch (action.type) {
    case "EMAIL":
      return {...state, email: action.payload};
    case "PASSWORD":
      return {...state, password: action.payload};
    default:
      return state;
  }
};

const initialUser:LoginUser = {
  email: 'neerajg1320@gmail.com',
  password: 'Local123',
}

const blankUser:LoginUser = {
  email: '',
  password: '',
}


const UserLogin = () => {
  const navigate = useNavigate();
  const [user, dispatch] = useReducer(reducer, blankUser);
  const { authenticateUser } = useActions();
  const isAuthenticated = useTypedSelector<boolean>(state => state.auth.isAuthenticated);
  const loginState = useTypedSelector(state => state.auth.login);

  useEffect( () => {
    if (isAuthenticated) {
      // Created an IIFE (Immediately Invoked Function Expression) for adding delay after success.
      // For debugging purpose
      (async () => {
        await setTimeout(() => {
          navigate(RoutePath.LOGIN_SUCCESS);
        }, 1000);
      })();
    }
  }, [isAuthenticated]);

  const handleLoginClick = () => {
    if (debugAuth) {
      console.log(`Login click`);
    }
    if (user.email) {
      authenticateUser(user.email, user.password);
    } else {
      console.error(`Error! currentUser not defined in redux`);
    }
  }

  const handleCancelClick = () => {
    navigate(RoutePath.BACK);
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
                value={user.password}
                onChange={(e) => {dispatch({type: "PASSWORD", payload: e.target.value});}}
            />
          </div>

          <div style={{display:"flex", flexDirection:"row", gap:"40px", marginTop: "40px"}}>
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

          {/* Status section */}
          {loginState.requestStarted && <div>Authenticating User ...</div>
          }
          {loginState.requestCompleted &&
              <>
              <div>Authentication {isAuthenticated? 'Successful' : 'Failed'}</div>
                {loginState.err ?
                    <span>{loginState.err}</span>
                    :
                    <div>{loginState.msg}</div>
                }
              </>
          }
        </div>
      </div>
  );
}

export default UserLogin;