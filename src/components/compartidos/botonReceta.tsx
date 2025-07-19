import React from "react";
import { IonButton } from "@ionic/react";

interface CondicionalBotonAccionProps {
  mostrar: boolean;
  texto: string;
  color?: string;
  onClick: () => void;
}

const CondicionalBotonAccion: React.FC<CondicionalBotonAccionProps> = ({
  mostrar,
  texto,
  color = "primary",
  onClick,
}) => {
  if (!mostrar) return null;

  return (
    <div style={{ marginTop: "5px", textAlign: "center" }}>
      <IonButton fill="outline" color={color as any} onClick={onClick}>
        {texto}
      </IonButton>
    </div>
  );
};

export default CondicionalBotonAccion;
