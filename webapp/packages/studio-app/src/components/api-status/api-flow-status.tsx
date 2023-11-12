import React from "react";
import {ApiFlowState} from "../../state/api";
import {useActions} from "../../hooks/use-actions";

interface ApiFlowStatusProps {
  reqMsg:string
  apiFlowState: ApiFlowState;
};

const ApiFlowStatus:React.FC<ApiFlowStatusProps> = ({reqMsg, apiFlowState}) => {
  const {apiFlowReset} = useActions();

  const handleClick = () => {
    console.log("clicked");
    apiFlowReset();
  }

  return (
    <div>
      {(apiFlowState.requestStarted && !apiFlowState.requestCompleted) && <div>{reqMsg}</div>
      }
      {(apiFlowState.requestCompleted && apiFlowState.error) &&
          <div style={{display: "flex", flexDirection:"row", alignItems:"center", gap:"10px", justifyContent:"center"}}>
            <span>{apiFlowState.error}</span>
            <button onClick={handleClick}>ok</button>
          </div>
      }
    </div>
  )
};

export default ApiFlowStatus;