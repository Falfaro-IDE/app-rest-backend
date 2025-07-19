import React, { useState } from "react";
import { IonContent, IonItem, IonPage, useIonRouter } from "@ionic/react";
import CustomInput from "../../components/compartidos/CustomInput";
import CustomButton from "../../components/compartidos/CustomButton";
import { useAuth } from "../../hooks/useAuth";
import './Correo.css'

const Correo: React.FC = () => {
    const [correo, setCorreo] = useState("");
    const { handleCorreo,LoadingComponent,showToast, ToastComponent } = useAuth();
    const router = useIonRouter();
    const [isEmailValid, setIsEmailValid] = useState(false);

    const enviarCorreo = async () => {

      if(correo == ""){
          showToast('Ingrese correctamente el correo.', 3000, "warning");
          return;
      }

      if(isEmailValid) {
        const response = await handleCorreo(correo);
        if (response.success) {
            setTimeout(() => {
                setCorreo("");
            }, 5000);
        }
      }else{
        showToast('Corrige los errores antes de enviar', 3000, "warning");
      }
    }

  return (
    <div className="div-container-correo" onKeyDown={(e) => e.key === "Enter" && enviarCorreo()} tabIndex={0}>
        {LoadingComponent}
        {ToastComponent}
      <div className="ion-padding div-correo">
        <h1>Recuperar contraseña</h1>
        <div>
        <IonItem>
            <CustomInput
            label="Ingrese correo"
            type="email"
            value={correo}
            onIonChange={(e) => setCorreo(e.detail.value!)}
            placeholder="Ingrese su correo"
            required
            className='color-input-app'
            onValidate={setIsEmailValid}
            labelPlacement="floating"
            />
        </IonItem>
        <CustomButton onClick={enviarCorreo} text="Enviar correo" color="dark" expand={'full'} className='color-primary-app'/>
        </div>
      </div>
    </div>

  );
};

export default Correo;