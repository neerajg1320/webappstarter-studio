import './user-register.css';
import React, {useState} from "react";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import {ReduxUpdateUserPartial, ReduxUser} from "../../state/user";
import {useActions} from "../../hooks/use-actions";

const UserRegister = () => {
  const currentUser = useTypedSelector<ReduxUser|null>(state => state.auth.currentUser);
  const { updateUser, registerUser } = useActions();
  const [password, setPassword] = useState<string>('Local123');

  const handleRegisterClick = () => {
    if (currentUser && currentUser.email) {
      registerUser(currentUser?.email, password);
    } else {
      console.error(`Error! currentUser not defined in redux`);
    }
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

          <div style={{display:"flex", flexDirection:"row", gap:"20px"}}>
            <button
                className="button is-primary is-small"
                onClick={handleRegisterClick}
                disabled={!currentUser || !currentUser.email || !password}
            >
              Register
            </button>
          </div>
        </div>
      </div>
  );
}

export default UserRegister;