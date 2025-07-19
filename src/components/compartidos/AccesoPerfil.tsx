import React from "react";
import { IonPage, IonContent, IonButton, useIonRouter } from "@ionic/react";
import { useHistory } from "react-router-dom";
import imgRecurso from '../../assets/img/img-acceso-denegado.jpg';
import './ErrorConexion.css'

const AccesoPerfil: React.FC = () => {
    const router = useIonRouter();

  return (
    <div className="ion-padding center-div">
    <div>
      <div className='div-img-error-recurso'>
        <img src={imgRecurso} alt="" className='img-error-recurso' />
      </div>
      <div className="div-img-error-recurso">
        <h2>No tienes acceso a esta ruta </h2>
        <p>Probar nuevamente.</p>
      </div>
      <div>
        <IonButton expand="full" onClick={() => router.push("/login")}>
            Volver al Inicio
        </IonButton>
      </div>

    </div>
  </div>
  );
};

export default AccesoPerfil;