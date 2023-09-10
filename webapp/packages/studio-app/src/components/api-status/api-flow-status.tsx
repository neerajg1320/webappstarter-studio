import React from "react";
import {ApiFlowState} from "../../state/api";

interface ApiFlowStatusProps {
  reqMsg:string
  apiFlowState: ApiFlowState;
};

const ApiFlowStatus:React.FC<ApiFlowStatusProps> = ({reqMsg, apiFlowState}) => {

  return (
    <div>
      {(apiFlowState.requestStarted && !apiFlowState.requestCompleted) && <div>{reqMsg}</div>
      }
      {apiFlowState.requestCompleted &&
          <>
            {apiFlowState.error ?
                <div>{apiFlowState.error}</div>
                :
                <div>{apiFlowState.message}</div>
            }
          </>
      }
    </div>
  )
};

export default ApiFlowStatus;