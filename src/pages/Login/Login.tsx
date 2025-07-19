import { IonPage, IonContent, IonInput, IonButton, IonLabel, IonItem, useIonRouter, IonIcon, IonButtons } from '@ionic/react';
import { useEffect, useState } from 'react';
import './Login.css';
import { IonImg } from '@ionic/react';
import CustomInput from '../../components/compartidos/CustomInput';
import CustomButton from '../../components/compartidos/CustomButton';
import { useAuth } from '../../hooks/useAuth';
import values from '../../models/clases/values';
import { useHistory } from 'react-router';
import { StorageService } from '../../utils/storageService';
import { sessionesRutas } from '../../utils/sessionesRutas';

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const hostname = window.location.hostname;
  const parts = hostname.split(".");
  const portadaLogin  = values.carpetasS3.linkS3 + values.carpetasS3.carpeta + values.rutas.subnodmino + values.carpetasS3.portada;
  const logoLogin     = values.carpetasS3.linkS3 + values.carpetasS3.carpeta + values.rutas.subnodmino + values.carpetasS3.logo;
  const { handleLogin, loading, error,LoadingComponent,showToast, ToastComponent } = useAuth();
  const router = useIonRouter();
  const history = useHistory();
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [isPasswordValid, setPasswordValid]   = useState(false);

  const handleLoginClick = async () => {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    if(trimmedUsername === "" && trimmedPassword === ""){
      showToast('Ingrese correctamente sus credenciales.', 3000, "warning");
      setUsername("");
      setPassword("");
      return;
    }
    if(trimmedUsername === ""){
      showToast('Ingrese su usuario correctamente.', 3000, "warning");
      setUsername("");
      return;
    }
    if(trimmedPassword === ""){
      showToast('Ingrese su contraseña correctamente.', 3000, "warning");
      setPassword("");
      return;
    }
   if(isUsernameValid && isPasswordValid){
      const response = await handleLogin(trimmedUsername, trimmedPassword);
      console.log("response login", response);
      if (response.success) {
        await StorageService.setItem(values.storage.keySession, response.data);
        const storedSession = await StorageService.getItem(values.storage.keySession);
        if (storedSession) {
          router.push(values.rutas.rutas.homePrincipal.rutaPrincipal + values.rutas.rutas.homePrincipal.bienvenida, "forward");
        } else {
          showToast("Error al guardar sesión. Intente nuevamente.", 3000, "danger");
        }
      }

   }else{
    showToast('Ingrese correctamente sus credenciales.', 3000, "warning");
   }
  };

  const handleRecoverPassword = () => {
    router.push(values.rutas.enviarCorreo, "forward");
  };

  useEffect(() => {
    sessionesRutas.restSession(router);
  }, [])
  

  return (
    <IonPage>
      <IonContent onKeyDown={(e) => e.key === "Enter" && handleLoginClick()} tabIndex={0}>
      {LoadingComponent}
      {ToastComponent}
        <div className='div-login'>
            <div className='div-login-img'>
              <IonImg src={portadaLogin} class='login-img' />
            </div>

            <div className='div-login-session'>
              <div className='div-login-session-with'>
                <div className='div-logo-img'>
                  <IonImg src={logoLogin} class='login-logo-img' />
                </div>

                <h2 className='center-text-app'>Bienvenido</h2>

                <div className='center-text-app div-ingrese-datos'>
                  <label className='center-text'>Ingrese sus datos de acceso</label>
                </div>

                <IonItem >  
                  <CustomInput
                    label="Usuario"
                    type="text"
                    value={username}
                    onIonChange={(e) => setUsername(e.detail.value!)}
                    placeholder="Ingrese su usuario"
                    className='color-input-app'
                    onValidate={setIsUsernameValid}
                    labelPlacement="floating"
                    cantidadMaxLenght={50}
                  />
                </IonItem>
                <IonItem >
                  <CustomInput
                    label="Contraseña"
                    type="password"
                    value={password}
                    onIonChange={(e) => setPassword(e.detail.value!)}
                    placeholder="Ingrese su contraseña"
                    required
                    className='color-input-app'
                    onValidate={setPasswordValid}
                    labelPlacement="floating"
                    cantidadMaxLenght={255}
                  />
                </IonItem>

                <CustomButton text="Iniciar Sesión" onClick={handleLoginClick} expand={'full'} className=''/>

                <div className='center-text-app'>
                <p className="">
                    ¿Olvidaste tu contraseña?  
                    <span 
                    className="color-input-primary" 
                    onClick={handleRecoverPassword}
                    style={{padding:5, cursor:'pointer'}}
                    >
                    Recuperar
                    </span>
                </p>
                </div>
              </div>
            </div>
        </div>

      </IonContent>
    </IonPage>
  );
};

export default Login;