import React, {useState} from "react";
import { useActions } from "../../hooks/use-actions";
import { useNavigate, useParams } from "react-router-dom";
import { RoutePath } from "../routes";
import { useTypedSelector } from "../../hooks/use-typed-selector";
import UserFlowStatus from "./user-flow-status";
import "./user.css";
import Button from "../app-components/button";

const UserActivate = () => {
  const navigate = useNavigate();
  const { activateUser } = useActions();
  const { key } = useParams();
  const apiState = useTypedSelector((state) => state.auth.api);
  const [apiStateDuration, setApiStateDuration] = useState(false);

  console.log(`UserActivate:render key=`, key);

  const handleActivateClick = () => {
    if (key) {
      activateUser(key);
    } else {
      console.error(`Error! key not defined in activation url`);
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

  return (
    <div className="form-wrapper">
      <div className="form">
        <h2>User Key</h2>
        <span>{key}</span>
        {!apiState.requestCompleted || apiState.error ? (
          <div className="form-submit-cancel-btn" >
            <Button
            buttonClass="form-submit-btn"
            title="Activate"
            buttonType="submit"
            handleButtonClick={handleActivateClick}
          />
            {/* </Link> */}
            <Button
            buttonClass="cancel-btn"
            handleButtonClick={handleCancelClick}
            buttonType="button"
            title="Cancel"
          />
          </div>
        ) : (
          <Button
            buttonClass="form-submit-btn"
            title="Login"
            buttonType="submit"
            handleButtonClick={handleLoginClick}
          />
        )}
         {apiStateDuration && (
            <UserFlowStatus
              reqMsg="Authenticating User ..."
              email=""
              flowState={apiState}
            />
          )}
      </div>
    </div>
  );
};

export default UserActivate;

{
  /* <div style={{
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

          {/* Status section */
}
//     <UserFlowStatus reqMsg="Activating User ..." email="" flowState={apiState} />
//   </div>
// </div> */}
