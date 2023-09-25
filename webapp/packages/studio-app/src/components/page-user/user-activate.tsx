import React from "react";
import {useActions} from "../../hooks/use-actions";
import {useNavigate, useParams} from "react-router-dom";
import {RoutePath} from "../routes";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import UserFlowStatus from "./user-flow-status";
import './user.css';

const UserActivate = () => {
  const navigate = useNavigate();
  const { activateUser } = useActions();
  const { key } = useParams();
  const apiState = useTypedSelector(state => state.auth.api);

  console.log(`UserActivate:render key=`, key);

  const handleActivateClick = () => {
    if (key) {
      activateUser(key);
    } else {
      console.error(`Error! key not defined in activation url`);
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
          <div style={{width: "100%", display: "flex", flexDirection: "row", gap: "20px", alignItems:"center", overflow: "hidden"}}>
            <div style={{width: "100%", display: "flex", flexDirection: "column", alignItems: "center"}}>
              <span>User Key:</span>
              <span>{key}</span>
            </div>
          </div>

          <div style={{display:"flex", flexDirection:"row", gap:"40px", marginTop: "40px"}}>
            {(!apiState.requestCompleted || apiState.error)?
              <>
                <button
                    className="button is-primary is-small"
                    onClick={handleActivateClick}
                >
                  Activate
                </button>
                <button
                className="button is-family-secondary is-small"
                onClick={() => {handleCancelClick()}}
                >
                Cancel
                </button>
              </>
                :
              <button
              className="button is-primary is-small"
              onClick={handleLoginClick}
              >
                Login
              </button>
            }

          </div>

          {/* Status section */}
          <UserFlowStatus reqMsg="Activating User ..." email="" flowState={apiState} />
        </div>
      </div>
  );
}

export default UserActivate;