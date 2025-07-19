import React from "react";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
} from "@ionic/react";
import "./CartaInforme.css";

interface Props {
  titulo: string;
  descripcion: string;
  ruta: string;
  icono: string;
}

const CartaInforme: React.FC<Props> = ({ titulo, descripcion, ruta, icono }) => {
  return (
    <IonCard className="card-informe">
      <IonCardHeader>
        <IonCardTitle className="card-titulo">
          <IonIcon icon={icono} className="icono-informe" />
          {titulo}
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <p className="card-descripcion">{descripcion}</p>
        <div className="card-acciones">
          <IonButton size="small" color="primary" routerLink={ruta}>
            Ver Reporte
          </IonButton>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default CartaInforme;
