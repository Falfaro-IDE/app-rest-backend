// import React from 'react';
// import { IonAlert } from '@ionic/react';

// interface CustomAlertProps {
//   isOpen: boolean;
//   header?: string;
//   message?: string;
//   onConfirm: () => void;
//   onCancel?: () => void;
//   onDidDismiss?: () => void;
// }

// const CustomAlert: React.FC<CustomAlertProps> = ({
//   isOpen,
//   header = 'Confirmación',
//   message = '¿Estás seguro?',
//   onConfirm,
//   onCancel,
//   onDidDismiss
// }) => {
//   return (
//     <IonAlert
//       isOpen={isOpen}
//       header={header}
//       message={message}
//       buttons={[
//         {
//           text: 'Cancelar',
//           role: 'cancel',
//           handler: () => {
//             onCancel?.();
//           },
//         },
//         {
//           text: 'Aceptar',
//           role: 'confirm',
//           handler: () => {
//             onConfirm();
//           },
//         },
//       ]}
//       onDidDismiss={onDidDismiss}
//     />
//   );
// };

// export default CustomAlert;

import React from 'react';
import { IonAlert } from '@ionic/react';

interface CustomAlertProps {
  isOpen: boolean;
  header?: string;
  message?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  onDidDismiss?: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  isOpen,
  header = 'Confirmación',
  message = '¿Estás seguro?',
  onConfirm,
  onCancel,
  onDidDismiss
}) => {
  const buttons = onCancel
    ? [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            onCancel();
          },
        },
        {
          text: 'Aceptar',
          role: 'confirm',
          handler: () => {
            onConfirm();
          },
        },
      ]
    : [
        {
          text: 'Aceptar',
          role: 'confirm',
          handler: () => {
            onConfirm();
          },
        },
      ];

  return (
    <IonAlert
      isOpen={isOpen}
      header={header}
      message={message}
      buttons={buttons}
      onDidDismiss={onDidDismiss}
      backdropDismiss={false}
    />
  );
};

export default CustomAlert;
