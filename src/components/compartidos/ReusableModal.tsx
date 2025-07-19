import React, { useState } from "react";
import { IonModal, IonButton, IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, IonButtons, IonInput, IonItem, IonLabel } from "@ionic/react";
import './ReusableModal.css'

interface ReusableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void;
  title?: string;
  cancelText?: string;
  confirmText?: string;
  children?: React.ReactNode; 
  classN?: string;
}

const ReusableModal: React.FC<ReusableModalProps> = ({ 
  isOpen,
  onClose,
  onConfirm,
  title = "Modal",
  cancelText = "Cancelar",
  confirmText = "OK",
  children,
  classN
}) => {
  const [formData, setFormData] = useState({ inputData: "" });

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} className={classN}>
      <IonHeader className="header-modal">
        <IonToolbar>
          <IonTitle>{title}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>✖</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {children}
      </IonContent>


      <IonFooter className="footer-modal">
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton color="danger" onClick={onClose}>{cancelText}</IonButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton color="primary" onClick={() => onConfirm(formData)}>{confirmText}</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonFooter>
    </IonModal>
  );
};

export default ReusableModal;