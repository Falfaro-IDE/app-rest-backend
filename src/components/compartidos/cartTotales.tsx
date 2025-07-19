import React from "react";
import { IonCard, IonCardContent } from "@ionic/react";

interface CartTotalesProps {
  color: string;
  descripcion: string;
  numero: number;
}

const CartTotales: React.FC<CartTotalesProps> = ({ color, descripcion, numero }) => {
  return (
    <IonCard style={{ borderTop: `5px solid ${color}` }}>
      <IonCardContent className="ion-text-center">
        <div style={{ fontSize: "1.6rem", color, fontWeight: "bold" }}>
          {numero.toFixed(2)}
        </div>
        <div style={{ color: "#666" }}>{descripcion}</div>
      </IonCardContent>
    </IonCard>
  );
};

export default CartTotales;
