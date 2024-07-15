import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showSuccessToastMessage = (txt) => {
  const position = "top-right";

  toast.success(`${txt}`, {
    position: position,
  });
};
