import { toast, cssTransition } from "react-toastify";

type position =
  | "top-right"
  | "top-center"
  | "top-left"
  | "bottom-right"
  | "bottom-center"
  | "bottom-left";
type theme = "light" | "dark" | "colored";

export const customToast = (
  msg: string,
  status: string,
  position: position,
  autoClose: number,
  theme: theme,
  hideProgressBar: boolean
) => {
  const bounce = cssTransition({
    enter: "toast__animate__fadeIn",
    exit: "toast__animate__fadeOut",
  });

  if (status === "success") {
    toast.success(msg, {
      theme: theme,
      position: position,
      hideProgressBar: hideProgressBar,
      autoClose: 60000,
      transition: bounce,
    });
  } else if (status === "error") {
    toast.error(msg, {
      theme: theme,
      position: position,
      hideProgressBar: hideProgressBar,
      autoClose: autoClose,
      transition: bounce,
    });
  }
};
