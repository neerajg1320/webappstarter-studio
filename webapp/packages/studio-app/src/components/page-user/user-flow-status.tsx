import {ReduxUser, UserFlowState} from "../../state/user";
import React, { useEffect } from "react";
import {useActions} from "../../hooks/use-actions";
import { BsFillExclamationCircleFill } from "react-icons/bs";

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
  // useEffect(()=>{
  //   setTimeout(()=>{
  //     flowState.error = "";
  //     flowState.message = ""
  //   }, 1000)
  // })
  console.log("flowState: ", flowState)

  return (
    <div>
      {(flowState.requestStarted && !flowState.requestCompleted) && <div>{reqMsg}</div>
      }
      {flowState.requestCompleted &&
          <>
            {flowState.error ?
                <div style={{ display:'flex', gap: '10px', alignItems: 'center', color:'rgb(239 68 68)', fontSize: '1rem'}}><BsFillExclamationCircleFill color="EF4444" size="22" />{flowState.error}
                  {flowState.error === "E-mail is not verified." &&
                      <span className="inverse-action" onClick={handleResendActivationClick} >
                        Resend Activation
                      </span>
                  }
                </div>
                :
                <div style={{display:'flex', gap: '10px', alignItems: 'center', fontSize: '1rem'}}><BsFillExclamationCircleFill color="#00a86b" size="22" />{flowState.message}</div>
            }
          </>
      }
    </div>
  )
};

export default UserFlowStatus;