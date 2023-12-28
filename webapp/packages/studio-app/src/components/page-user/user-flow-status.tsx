import { ReduxUser, UserFlowState } from "../../state/user";
import React, { useEffect } from "react";
import { useActions } from "../../hooks/use-actions";
import { BsFillExclamationCircleFill } from "react-icons/bs";
import { toast, cssTransition } from "react-toastify";
import { customToast } from "../app-components/customToast/toast";

interface UserFlowStatusProps {
  reqMsg: string;
  email: string;
  flowState: UserFlowState;
}

const UserFlowStatus: React.FC<UserFlowStatusProps> = ({
  reqMsg,
  email,
  flowState,
}) => {
  const { resendActivationEmail } = useActions();

  const handleResendActivationClick = () => {
    resendActivationEmail(email);
  };
  // useEffect(()=>{
  //   setTimeout(()=>{
  //     flowState.error = "";
  //     flowState.message = ""
  //   }, 1000)
  // })
  // console.log("flowState: ", flowState);

  useEffect(() => {
    if (flowState.error) {
      customToast(
        `${flowState.error}`,
        "error",
        "bottom-center",
        3000,
        "colored",
        true
      );
    } else if (flowState.message) {
      customToast(
        `${flowState.message}`,
        "success",
        "bottom-center",
        3000,
        "colored",
        true
      );
    }
  }, [flowState.error, flowState.requestCompleted]);

  return (
    <div
    style={{
      display: "flex",
      gap: "10px",
      alignItems: "center",
      color: "rgb(239 68 68)",
      fontSize: "1rem",
    }}
  >
      {flowState.error === "E-mail is not verified." && (
        <span className="inverse-action" onClick={handleResendActivationClick} >
          <BsFillExclamationCircleFill color="EF4444" size="22" />
          Resend Activation
        </span>
      )}
    </div>
    // <div>
    //   {flowState.requestStarted && !flowState.requestCompleted && (
    //     <div>{reqMsg}</div>
    //   )}
    //   {flowState.requestCompleted && (
    //     <>
    //       {flowState.error ? (
            // <div
            //   style={{
            //     display: "flex",
            //     gap: "10px",
            //     alignItems: "center",
            //     color: "rgb(239 68 68)",
            //     fontSize: "1rem",
            //   }}
            // >
    //           <BsFillExclamationCircleFill color="EF4444" size="22" />
    //           {flowState.error}
    //           {flowState.error === "E-mail is not verified." && (
    //             <span
    //               className="inverse-action"
    //               onClick={handleResendActivationClick}
    //             >
    //               Resend Activation
    //             </span>
    //           )}
    //         </div>
    //       ) : (
    //         <div
    //           style={{
    //             display: "flex",
    //             gap: "10px",
    //             alignItems: "center",
    //             fontSize: "1rem",
    //           }}
    //         >
    //           <BsFillExclamationCircleFill color="#00a86b" size="22" />
    //           {flowState.message}
    //         </div>
    //       )}
    //     </>
    //   )}
    // </div>
  );
};

export default UserFlowStatus;
