import { IonButton, IonCard, IonCardContent, IonCol, IonGrid, IonIcon, IonItem, IonLabel, IonList, IonNote, IonRow } from '@ionic/react';
import React, { useState } from 'react'
import { listCircle, cogOutline } from "ionicons/icons";
import CustomInput from '../../../../components/compartidos/CustomInput';
import { StorageService } from '../../../../utils/storageService';
import values from '../../../../models/clases/values';
import Configuracion from './Configuracion';

const ConfiguracionInicial : React.FC = () => {
  const [selected, setSelected] = useState('Configuración');
  const menuItems = [
    { label: 'Configuración', color: 'danger' },
    { label: 'Shopping', color: 'tertiary' },
    { label: 'Cleaning', color: 'success' },
    { label: 'Reminders', color: 'warning' }
  ];
  let user = StorageService.getItem(values.storage.keySession);


  return (
    <div className='background-home-principal'>
          
    </div>
  )
}

export default ConfiguracionInicial;