import {ReduxUser, UserFlowState} from "../../state/user";
import React, {useEffect} from "react";
import {useActions} from "../../hooks/use-actions";
import ToastMaker from "../common/toasts/toast-maker";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import {withLifecyleLogger} from "../../hoc/logger";

interface UserFlowStatusProps {
  reqMsg:string
  email:string;
  flowState: UserFlowState;
};

const UserFlowStatus:React.FC<UserFlowStatusProps> = ({reqMsg, email}) => {
  const {resendActivationEmail, userRequestReset} = useActions();
  const flowState = useTypedSelector(state => state.auth.api);

  const handleResendActivationClick = () => {
    resendActivationEmail(email);
  }

  const handleOnToastClose = () => {
    console.log(`Toast Closed`);
    userRequestReset();
  }

  return (
    <div>
      {(flowState.requestStarted && !flowState.requestCompleted) && <div>{reqMsg}</div>
      }
      {flowState.requestCompleted &&
          <>
            {flowState.error &&
                <div>
                  {flowState.error === "E-mail is not verified." &&
                      <span className="inverse-action" onClick={handleResendActivationClick}>
                        Resend Activation
                      </span>
                  }
                </div>
            }
            {(flowState.error && !flowState.displayed) &&
                <ToastMaker message={flowState.error} onClose={handleOnToastClose}/>
            }
          </>
      }
    </div>
  )
};

export default withLifecyleLogger(UserFlowStatus);