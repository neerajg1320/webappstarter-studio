import React, { useEffect } from "react";
import { ApiFlowState } from "../../state/api";
import { useActions } from "../../hooks/use-actions";
import { BsFillExclamationCircleFill } from "react-icons/bs";
import { toast } from "react-toastify";
import { theme } from "../../context/ThemeContext/theme.config";

interface ApiFlowStatusProps {
  reqMsg: string;
  apiFlowState: ApiFlowState;
}

const ApiFlowStatus: React.FC<ApiFlowStatusProps> = ({
  reqMsg,
  apiFlowState,
}) => {
  const { apiFlowReset } = useActions();

  // const handleClick = () => {
  //   console.log("clicked");
  //   apiFlowReset();
  // }

  useEffect(() => {
    const timeOut = setTimeout(() => {
      apiFlowReset();
    }, 30000);

    toast.error(`${apiFlowState.error}`, {theme: "colored"})
    return ()=>{
      clearTimeout(timeOut)
    };
  }, [apiFlowState.error]);

  return (
    // <div>
    //   {apiFlowState.requestStarted && !apiFlowState.requestCompleted && (
    //     <div>{reqMsg}</div>
    //   )}
    //   {apiFlowState.requestCompleted && apiFlowState.error && (
    //     <div
    //       style={{
    //         display: "flex",
    //         flexDirection: "row",
    //         alignItems: "center",
    //         gap: "10px",
    //         justifyContent: "center",
    //       }}
    //     >
    //       <span
    //         style={{
    //           display: "flex",
    //           gap: "10px",
    //           alignItems: "center",
    //           color: "rgb(239 68 68)",
    //           fontSize: "1rem",
    //         }}
    //       >
    //         <BsFillExclamationCircleFill color="EF4444" size="22" />
    //         {apiFlowState.error}
    //       </span>
    //       {/* <button onClick={handleClick}>ok</button> */}
    //     </div>
    //   )}
    // </div>
    <></>
  );
};

export default ApiFlowStatus;
