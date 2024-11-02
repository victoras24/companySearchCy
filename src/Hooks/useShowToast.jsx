import { useState } from "react";

export default function useShowToast() {
  const [showToast, setShowToast] = useState(false);
  const [toastContent, setToastContent] = useState({ text: "", status: "" });

  const displayToast = ({ text, status }) => {
    setToastContent({ text, status });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  return { showToast, toastContent, displayToast };
}
