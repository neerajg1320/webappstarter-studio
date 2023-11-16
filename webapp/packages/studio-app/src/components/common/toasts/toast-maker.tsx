import './toast-maker.css';
import React, {useEffect} from "react";
import { ToastContainer, toast } from 'react-toastify';
import {withLifecyleLogger} from "../../../hoc/logger";
import 'react-toastify/dist/ReactToastify.css';

interface ToastMakerProps {
  message: string;
  onOpen: () => void;
  onClose: () => void;
}


const ToastMaker:React.FC<ToastMakerProps> = ({message, onOpen:propOnOpen, onClose:propOnClose}) => {
  useEffect(() => {
    toast.error(message, {
      position: toast.POSITION.BOTTOM_CENTER,
      onOpen: propOnOpen,
      onClose: propOnClose,
    });
  }, [])

  return (
      <div>
        {/*<button className="toast-maker-button" onClick={showToastMessage}>Notify</button>*/}
        <ToastContainer />
      </div>
  );
}

export default withLifecyleLogger(ToastMaker);
