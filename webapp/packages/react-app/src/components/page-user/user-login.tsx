import {ReduxUpdateUserPartial, ReduxUser} from "../../state/user";
import React, {useEffect, useState} from "react";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import {useActions} from "../../hooks/use-actions";
import {useNavigate} from "react-router-dom";
import {RoutePath} from "../routes";

const UserLogin = () => {
  const navigate = useNavigate();
  const currentUser = useTypedSelector<ReduxUser|null>(state => state.auth.currentUser);
  const { updateUser, authenticateUser } = useActions();
  const [password, setPassword] = useState<string>('Local123');
  const isAuthenticated = useTypedSelector<boolean>(state => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(RoutePath.LOGIN_SUCCESS);
    }
  }, [isAuthenticated]);

  const handleLoginClick = () => {
    if (currentUser && currentUser.email) {
      authenticateUser(currentUser?.email, password);
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
                type="text" value={currentUser?.email}
                onChange={(e) => {updateUser({...currentUser, email: e.target.value} as ReduxUpdateUserPartial)}}
            />
          </div>
          <div className="user-value" style={{display: "flex"}}>
            <label>Password</label>
            <input
                className="value"
                value={password || ''}
                onChange={(e) => {setPassword(e.target.value)}}
            />
          </div>

          <div style={{display:"flex", flexDirection:"row", gap:"40px", marginTop: "40px"}}>
            <button
                className="button is-primary is-small"
                onClick={handleLoginClick}
                disabled={!currentUser || !currentUser.email || !password}
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
        </div>
      </div>
  );
}

export default UserLogin;