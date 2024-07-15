import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showErrorToastMessage = (txt, pos) => {
  const position = "top-right";

  toast.error(`${txt}`, {
    position: position,
  });
};
