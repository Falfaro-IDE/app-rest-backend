import React, { useState } from "react";
import { IonPage, IonContent, IonButton, IonSegment, IonSegmentButton, IonLabel } from "@ionic/react";
import { useHistory } from "react-router-dom";
import Cocina from "./Cocina/Cocina";
import './AreaProduccion.css'

const AreaProduccion: React.FC = () => {
    const [selectedSegment, setSelectedSegment] = useState<any>('default');
    const history = useHistory();

  return (
    <div className="background-home-principal">
      <div>
        {/* <IonSegment className="segment-produccion fadeInDown" mode="md" value={selectedSegment} onIonChange={(e) => setSelectedSegment(e.detail.value)}>
          <IonSegmentButton value="default" className="segment-button">
            <IonLabel>Mesas</IonLabel>
          </IonSegmentButton>
        </IonSegment> */}
        
        {selectedSegment === 'default' && (
          <div>
              <Cocina></Cocina>
          </div>
        )}
      </div>
    </div>
  );
};

export default AreaProduccion;