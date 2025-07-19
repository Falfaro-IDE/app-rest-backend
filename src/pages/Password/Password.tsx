import React, { useState } from "react";
import { IonContent, IonItem, IonPage, useIonRouter } from "@ionic/react";
import CustomInput from "../../components/compartidos/CustomInput";
import CustomButton from "../../components/compartidos/CustomButton";
import './Password.css'
import { useAuth } from "../../hooks/useAuth";
import { useParams } from "react-router-dom";

interface RouteParams {
  token: string;
}

const Password: React.FC = () => {
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const { handlePassword,LoadingComponent,showToast, ToastComponent } = useAuth();
    const router = useIonRouter();
    const { token } = useParams<RouteParams>();
    
    const enviarPassword = async () => {
      console.log(token);
        if(password1 == ""){
            showToast('Ingrese correctamente la contraseña.', 3000, "warning");
            return;
          }

        const response = await handlePassword({password1,token: token});
        console.log("response correo",response);
        if (response.success) {
            setTimeout(() => {
                router.push("/login", "forward");
            }, 3000);
        }
    }

  return (
    <div className="div-container-password" onKeyDown={(e) => e.key === "Enter" && enviarPassword()} tabIndex={0}>
    {LoadingComponent}
    {ToastComponent}
      <div className="ion-padding div-password">
        <h1>Actualizar contraseña</h1>
        <div>
        <IonItem>
            <CustomInput
            label="Contraseña"
            type="password"
            value={password1}
            onIonChange={(e) => setPassword1(e.detail.value!)}
            placeholder="Ingrese su contraseña"
            required
            className='color-input-app'
            labelPlacement="floating"
            />
        </IonItem>
        <IonItem>
            <CustomInput
            label="Ingrese nuevamente contraseña"
            type="password"
            value={password2}
            onIonChange={(e) => setPassword2(e.detail.value!)}
            placeholder="Ingrese nuevamente tu contraseña"
            required
            className='color-input-app'
            labelPlacement="floating"
            />
        </IonItem>

        <CustomButton onClick={enviarPassword}  text="Cambiar contraseña" color="dark" expand={'full'} className='color-primary-app'/>

        </div>
      </div>
    </div>

  );
};

export default Password;