import { useState } from "react";
import { IonToast } from "@ionic/react";

type ToastColor = "primary" | "secondary" | "tertiary" | "success" | "warning" | "danger" | "light" | "medium" | "dark";

const useToast = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [duration, setDuration] = useState(2000);
  const [color, setColor] = useState<ToastColor>("primary");

  const showToast = (msg: string, durationMs = 2000, colorType: ToastColor = "primary") => {
    setMessage(msg);
    setDuration(durationMs);
    setColor(colorType);
    setIsOpen(true);
  };

  const ToastComponent = (
    <IonToast
      isOpen={isOpen}
      message={message}
      duration={duration}
      color={color}
      onDidDismiss={() => setIsOpen(false)}
    />
  );

  return { showToast, ToastComponent };
};

export default useToast;