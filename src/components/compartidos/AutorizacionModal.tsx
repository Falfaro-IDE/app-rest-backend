import React, { useEffect, useState } from "react";
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
import { alertCircleOutline } from "ionicons/icons";
import './ReusableModal.css';
import './ValidarCodigoModal.css';

interface AutorizacionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { autorizador: string; pin: string; motivo: string }) => void;
  title?: string;
  confirmText?: string;
  cancelText?: string;
}

const AutorizacionModal: React.FC<AutorizacionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title = "Autorización requerida",
  confirmText = "Autorizar",
  cancelText = "Cancelar",
}) => {
  const [autorizadorId, setAutorizadorId] = useState("");
  const [pin, setPin] = useState("");
  const [motivo, setMotivo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAutorizadorId("");
    setPin("");
    setMotivo("");
  }, [isOpen])
  

  const handleConfirm = async () => {
    setError(null);

    if (!autorizadorId || !pin) {
      setError("Debe ingresar ID del autorizador y PIN.");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        autorizador: autorizadorId,
        pin,
        motivo,
      });
    } catch (err) {
      setError("Error al autorizar.");
    }
    setLoading(false);
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} className="modal-validar-codigo" backdropDismiss={false}>
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
            <IonIcon icon={alertCircleOutline} className="icon-alerta-codigo" />
          </div>

          <IonItem lines="none" className="item-codigo">
            <IonLabel position="stacked">Autorizador</IonLabel>
            <IonInput
              value={autorizadorId}
              onIonChange={(e) => setAutorizadorId(e.detail.value!)}
              placeholder="Ingrese usuario"
              type="text"
            />
          </IonItem>

          <IonItem lines="none" className="item-codigo">
            <IonLabel position="stacked">PIN</IonLabel>
            <IonInput
              value={pin}
              onIonChange={(e) => setPin(e.detail.value!)}
              placeholder="Ingresa el PIN"
              type="text"
              style={{ WebkitTextSecurity: "disc" }}
            />
          </IonItem>

          <IonItem lines="none" className="item-codigo">
            <IonLabel position="stacked">Motivo</IonLabel>
            <IonInput
              value={motivo}
              onIonChange={(e) => setMotivo(e.detail.value!)}
              placeholder="Ingresa el motivo"
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
            <IonButton color="danger" onClick={onClose}>
              {cancelText}
            </IonButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton color="primary" onClick={handleConfirm}>
              {loading ? <IonSpinner name="dots" /> : confirmText}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonFooter>
    </IonModal>
  );
};

export default AutorizacionModal;