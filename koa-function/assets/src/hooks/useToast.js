import { Toast } from "@shopify/polaris";
import { useCallback, useState } from "react";

const useToast = () => {
  const [isActiveToast, setIsActiveToast] = useState(false);
  const [toastContent, setToastContent] = useState("");

  const toggleActiveToast = useCallback(
    () => setIsActiveToast((active) => !active),
    [],
  );
  const CustomToast = () =>
    isActiveToast ? (
      <Toast content={toastContent} onDismiss={toggleActiveToast} />
    ) : null;
  return { CustomToast, isActiveToast, setIsActiveToast, setToastContent };
};

export default useToast;
