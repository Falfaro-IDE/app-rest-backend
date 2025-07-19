import React from "react";
import { IonPage, IonContent, IonButton } from "@ionic/react";
import { useHistory } from "react-router-dom";

const NotFound: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <h2>404 - Página No Encontrada</h2>
        <p>La ruta que buscas no existe.</p>
        <IonButton expand="full" onClick={() => history.push("/login")}>
          Volver al Inicio
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default NotFound;