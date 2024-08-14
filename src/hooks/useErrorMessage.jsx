import { useSoftUIController } from "~/context";
import { setAlertMessage } from "~/context/common/action";

export default function useErrorMessage() {
  const [, dispatch] = useSoftUIController();

  function setErrorMessage(message, isOpen = true) {
    setAlertMessage(dispatch, {
      message: message,
      type: "error",
      openAlert: isOpen,
    });
  }

  return {
    setErrorMessage
  }

}
