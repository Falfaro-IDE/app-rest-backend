import { IonButton, IonCard, IonCardContent, IonCol, IonGrid, IonIcon, IonItem, IonLabel, IonList, IonNote, IonRow } from '@ionic/react';
import React, { useEffect, useState } from 'react'
import { listCircle, cogOutline } from "ionicons/icons";
import './Configuracion.css';
import CustomInput from '../../../../components/compartidos/CustomInput';
import { StorageService } from '../../../../utils/storageService';
import values from '../../../../models/clases/values';
import { useEmpresa } from '../../../../hooks/useEmpresa';
import { EmpresaClass } from '../../../../models/clases/Empresa';

const Configuracion : React.FC = () => {
  const [selected, setSelected] = useState('Configuración');
  const menuItems = [
    { label: 'Configuración', color: 'danger' },
    { label: 'Shopping', color: 'tertiary' },
    { label: 'Cleaning', color: 'success' },
    { label: 'Reminders', color: 'warning' }
  ];
  let user = StorageService.getItem(values.storage.keySession);
  const [ codigo, setCodigo] = useState();
  const { actualizarCodigoHook, LoadingComponent, ToastComponent } = useEmpresa();
  const [ empresa, setEmpresa ] = useState(new EmpresaClass());

  useEffect(() => {
    if(user) {
      setCodigo(user.objeto.codigo_seguridad);
    }
  }, [])

  const guardarCodigo = async () => {
    const response:any = await actualizarCodigoHook({...empresa, codigo_seguridad: codigo});
        if(response.success){
            console.log("actualizacion", response.data.objeto);
        }
  }
  

  return (
      <div className='ion-padding'>
        <h2 className='titulo-configuracion'><IonIcon slot="start" icon={cogOutline} size="large" /> Configuración</h2>
        <div>
          
          <IonItem>
            <IonLabel position="stacked">Código de seguridad</IonLabel>
            <CustomInput
              label=""
              type="text"
              value={codigo}
              onIonChange={(e) =>  setCodigo(e.detail.value)}
              placeholder=""
              required
              className='color-input-app'
              labelPlacement=""
            />
          </IonItem>
          <div className='div-button-configuracion'>
              <IonButton
                  
                  color="success"
                  style={{ marginTop: "15px" }}
                  onClick={() => {
                    guardarCodigo();
                  }}
              >
                  Guardar
              </IonButton>
          </div>
        </div>
      </div>

  )
}

export default Configuracion;