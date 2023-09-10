import {ReduxUser, UserFlowState} from "../../state/user";
import React from "react";
import {useActions} from "../../hooks/use-actions";

interface UserFlowStatusProps {
  reqMsg:string
  email:string;
  flowState: UserFlowState;
};

const UserFlowStatus:React.FC<UserFlowStatusProps> = ({reqMsg, email, flowState}) => {
  const {resendActivationEmail} = useActions();

  const handleResendActivationClick = () => {
    resendActivationEmail(email);
  }

  return (
    <div>
      {(flowState.requestStarted && !flowState.requestCompleted) && <div>{reqMsg}</div>
      }
      {flowState.requestCompleted &&
          <>
            {flowState.error ?
                <div>{flowState.error}
                  {flowState.error === "E-mail is not verified." &&
                      <span className="inverse-action" onClick={handleResendActivationClick} >
                        Resend Activation
                      </span>
                  }
                </div>
                :
                <div>{flowState.message}</div>
            }
          </>
      }
    </div>
  )
};

export default UserFlowStatus;