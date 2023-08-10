import './user.css';
import React, {useState} from "react";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import {ReduxUpdateUserPartial, ReduxUser} from "../../state/user";
import {useActions} from "../../hooks/use-actions";
import {useNavigate} from "react-router-dom";
import {RoutePath} from "../routes";

const UserRegister = () => {
  const navigate = useNavigate();
  const currentUser = useTypedSelector<ReduxUser|null>(state => state.auth.currentUser);
  const { updateUser, registerUser } = useActions();
  const [password1, setPassword1] = useState<string>('Local123');
  const [password2, setPassword2] = useState<string>('Local123');

  const handleRegisterClick = () => {
    if (currentUser && currentUser.email) {
      registerUser(currentUser?.email, password1, password2, currentUser?.first_name, currentUser?.last_name);
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
                type="text" value={currentUser?.email}
                onChange={(e) => {updateUser({...currentUser, email: e.target.value} as ReduxUpdateUserPartial)}}
            />
          </div>
          <div className="user-value" style={{display: "flex"}}>
            <label>Password</label>
            <input
                className="value"
                value={password1 || ''}
                onChange={(e) => {setPassword1(e.target.value)}}
            />
          </div>
          <div className="user-value" style={{display: "flex"}}>
            <label>Confirm Password</label>
            <input
                className="value"
                value={password2 || ''}
                onChange={(e) => {setPassword2(e.target.value)}}
            />
          </div>
          <div className="user-value" style={{display: "flex"}}>
            <label>First Name</label>
            <input
                className="value"
                type="text" value={currentUser?.first_name}
                onChange={(e) => {updateUser({...currentUser, first_name: e.target.value} as ReduxUpdateUserPartial)}}
            />
          </div>
          <div className="user-value" style={{display: "flex"}}>
            <label>First Name</label>
            <input
                className="value"
                type="text" value={currentUser?.last_name}
                onChange={(e) => {updateUser({...currentUser, last_name: e.target.value} as ReduxUpdateUserPartial)}}
            />
          </div>

          <div style={{display:"flex", flexDirection:"row", gap:"40px", marginTop:"40px"}}>
            <button
                className="button is-primary is-small"
                onClick={handleRegisterClick}
                disabled={!currentUser || !currentUser.email || !password1 || !password2}
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