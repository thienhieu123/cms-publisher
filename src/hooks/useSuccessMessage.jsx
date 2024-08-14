import { useSoftUIController } from "~/context";
import { setAlertMessage } from "~/context/common/action";

export default function useSuccessMessage() {
  const [, dispatch] = useSoftUIController();
  
  function setSuccessMessage(message, isOpen = true) {
    setAlertMessage(dispatch, {
      message: message,
      type: "success",
      openAlert: isOpen,
    });
  }

  return {
    setSuccessMessage
  }
}
