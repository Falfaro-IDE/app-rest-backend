import React from "react";
import { IonPage, IonContent, IonButton } from "@ionic/react";
import { useHistory } from "react-router-dom";

const Recurso: React.FC = () => {
  const history = useHistory();

  return (
    <>
      <div className="ion-padding">
        <h2>Recurso no encontrado</h2>
        <p>Por favor, vuelve actualizar o inicia sesión nuevamente .</p>
        <IonButton expand="full" onClick={() => history.push("/login")}>
          Volver a iniciar sesión
        </IonButton>
      </div>
    </>
  );
};

export default Recurso;