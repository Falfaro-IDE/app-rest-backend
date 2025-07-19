import { useState } from "react";
import { IonLoading } from "@ionic/react";

const useIonLoading = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("Cargando...");

  const showLoading = (msg = "Cargando...") => {
    setMessage(msg);
    setIsOpen(true);
  };

  const hideLoading = () => {
    setIsOpen(false);
  };

  const LoadingComponent = (
    <IonLoading isOpen={isOpen} message={message} onDidDismiss={hideLoading} />
  );

  return { showLoading, hideLoading, LoadingComponent };
};

export default useIonLoading;