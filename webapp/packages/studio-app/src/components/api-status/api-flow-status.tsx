import React from "react";
import {ApiFlowState} from "../../state/api";
import {useActions} from "../../hooks/use-actions";
import ToastMaker from "../common/toasts/toast-maker";

interface ApiFlowStatusProps {
  reqMsg:string
  apiFlowState: ApiFlowState;
};

const ApiFlowStatus:React.FC<ApiFlowStatusProps> = ({reqMsg, apiFlowState}) => {
  const {apiFlowReset} = useActions();

  const handleCloseClick = () => {
    console.log("clicked");
    apiFlowReset();
  }

  return (
    <div>
      {(apiFlowState.requestStarted && !apiFlowState.requestCompleted) && <div>{reqMsg}</div>
      }
      {(apiFlowState.requestCompleted && apiFlowState.error && false) &&
          <div style={{display: "flex", flexDirection:"row", alignItems:"center", gap:"10px", justifyContent:"center"}}>
            <span>{apiFlowState.error}</span>
            <button onClick={handleCloseClick}>ok</button>
          </div>
      }
      {(apiFlowState.requestCompleted && apiFlowState.error) &&
        <ToastMaker message={apiFlowState.error} onClose={handleCloseClick}/>
      }
    </div>
  )
};

export default ApiFlowStatus;