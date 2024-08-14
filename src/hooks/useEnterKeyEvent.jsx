import { useEffect } from "react";

export default function useEnterKeyEvent(dependencies, fn, condition = true) {
  useEffect(() => {
    if (condition) {
      const onEnterKeyEvent = (e) => {
        if (e.key === "Enter") {
          fn();
        }
      };

      document.addEventListener("keypress", onEnterKeyEvent);
      return () => {
        document.removeEventListener("keypress", onEnterKeyEvent);
      };
    }
  }, [dependencies]);
}
