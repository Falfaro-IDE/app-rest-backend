import React, { useState } from "react";
import { IonLabel, IonSegment, IonSegmentButton } from '@ionic/react';
import './Venta.css';
import Mesas from "./Mesas/Mesas";
import Mostrador from "./mostrador/Mostrador";



const Venta: React.FC = () => {
  const [selectedSegment, setSelectedSegment] = useState<any>('default');

  return (
    <div className="background-home-principal">
      <IonSegment className="segment-venta fadeInDown" mode="md" value={selectedSegment} onIonChange={(e) => setSelectedSegment(e.detail.value)}>
        <IonSegmentButton value="default" className="segment-button">
          <IonLabel>Mesas</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="mostrador" className="segment-button">
          <IonLabel>Mostrador</IonLabel>
        </IonSegmentButton> 
      </IonSegment>
      
      {selectedSegment === 'default' && (
        <div>
            <Mesas></Mesas>
        </div>
      )}

      {selectedSegment === 'mostrador' && (
        <div>
          <Mostrador></Mostrador>
        </div>
      )}
    </div>
  );
};

export default Venta;