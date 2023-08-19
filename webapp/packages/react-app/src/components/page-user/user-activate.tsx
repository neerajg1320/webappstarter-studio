import React from "react";
import {useActions} from "../../hooks/use-actions";
import {useNavigate, useParams} from "react-router-dom";
import {RoutePath} from "../routes";
import {useTypedSelector} from "../../hooks/use-typed-selector";


const UserActivate = () => {
  // const key = "MjM:1qUKq0:M87nAd1mq9mV_ly2rNLN1sxoYFEHUQfh00YrhIRuqFA";
  const navigate = useNavigate();
  const { activateUser } = useActions();
  const { key } = useParams();
  const activateState = useTypedSelector(state => state.auth.activate);

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
          <div style={{width: "100%",
            display: "flex", flexDirection: "row", gap: "20px"
          }}>
            <div className="user-value" style={{display: "flex"}}>
              <label>User Key:</label>
              <span>{key}</span>
            </div>
          </div>

          <div style={{display:"flex", flexDirection:"row", gap:"40px", marginTop: "40px"}}>
            {(!activateState.requestCompleted || activateState.error)?
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
          {activateState.requestStarted &&
              <div>Activating User ...</div>
          }
          {activateState.requestCompleted &&
              (activateState.error ?
                      <span>{activateState.error}</span>
                      :
                      <div>{activateState.message}</div>
              )
          }
        </div>
      </div>
  );
}

export default UserActivate;