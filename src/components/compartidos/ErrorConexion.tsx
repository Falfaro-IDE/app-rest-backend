import React from "react";
import { IonPage, IonContent, IonButton, useIonRouter } from "@ionic/react";
import { useHistory } from "react-router-dom";
import imgRecurso from '../../assets/img/img-error-recurso.webp';
import './ErrorConexion.css'
import CustomButton from "./CustomButton";
import { useAuth } from "../../hooks/useAuth";
import { StorageService } from "../../utils/storageService";
import values from "../../models/clases/values";

const ErrorConexion: React.FC = () => {
  const history = useHistory();
  const { handleLogout,LoadingComponent } = useAuth();
  const usuario = StorageService.getItem(values.storage.keySession);
  const router = useIonRouter();

const cerrarSession = async () => {  
  const response = await handleLogout(usuario.objeto.idUsuario);
  StorageService.clear();
  router.push(values.rutas.rutas.login, "forward");
}

  return (
    <div className="ion-padding center-div">
      {LoadingComponent}
      <div>
        <div className='div-img-error-recurso'>
          <img src={imgRecurso} alt="" className='img-error-recurso' />
        </div>
        <div className="div-img-error-recurso">
          <h2>Error de conexión</h2>
          <p>Por favor, vuelve en un momento .</p>
        </div>
        <div>
          <CustomButton text="Volver a la sesión" onClick={cerrarSession} expand={'full'} className=''/>
        </div>

      </div>
  </div>
  );
};

export default ErrorConexion;