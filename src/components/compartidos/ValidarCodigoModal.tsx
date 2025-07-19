import React, { useState } from "react";
import {
  IonModal,
  IonButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonFooter,
  IonButtons,
  IonInput,
  IonItem,
  IonLabel,
  IonText,
  IonSpinner,
  IonIcon,
} from "@ionic/react";
import './ReusableModal.css';
import './ValidarCodigoModal.css';
import { alertCircleOutline } from "ionicons/icons";
import { StorageService } from "../../utils/storageService";
import values from "../../models/clases/values";

interface ReusableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void; // solo se ejecuta si el código es válido
  title?: string;
  message?: string;
  cancelText?: string;
  confirmText?: string;
  classN?: string;
  //validateCode: (code: string) => Promise<boolean>; // función externa para validar
}

const ValidarCodigoModal: React.FC<ReusableModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmar acción",
  message = "¿Estás seguro de continuar?",
  cancelText = "Cancelar",
  confirmText = "Confirmar",
  classN,
  //validateCode
}) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


  const handleConfirm = async () => {
    setError(null);
    setLoading(true);
    try {
      //const isValid = await validateCode(code);
      let user = StorageService.getItem(values.storage.keySession);
      console.log("user", user);
      const isValid = false;
      if (user.objeto.codigo_seguridad == code) {
        onConfirm();
      } else {
        setError("Código inválido.");
      }
    } catch (err) {
      setError("Error al validar el código.");
    }
    setLoading(false);
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} className="modal-validar-codigo">
      <IonHeader className="header-modal">
        <IonToolbar>
          <IonTitle>{title}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>✖</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

    <IonContent className="ion-padding content-center">
    <div className="modal-body">
        <div>
            <IonIcon icon={alertCircleOutline} className="icon-alerta-codigo"></IonIcon>
        </div>
        <p className="message-text">{message}</p>

        <IonItem lines="none" className="item-codigo">
        <IonLabel position="stacked">Código de seguridad</IonLabel>
        <IonInput
            value={code}
            onIonChange={e => setCode(e.detail.value!)}
            placeholder="Ingresa el código"
            type="text"
            /* inputMode="numeric" */
            style={{ WebkitTextSecurity: 'disc' }}
        />
        </IonItem>

        {error && (
        <IonText color="danger">
            <p className="ion-padding-top">{error}</p>
        </IonText>
        )}
    </div>
    </IonContent>

      <IonFooter className="footer-modal">
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton color="danger" onClick={onClose}>{cancelText}</IonButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton color="primary" onClick={handleConfirm} >
              {loading ? <IonSpinner name="dots" /> : confirmText}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonFooter>
    </IonModal>
  );
};

export default ValidarCodigoModal;