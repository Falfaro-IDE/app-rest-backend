import React, { useEffect, useState } from "react";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCol,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonSpinner,
} from "@ionic/react";
import { lockClosedOutline } from "ionicons/icons";
import "./apertura.css";
import { useCaja } from "../../../hooks/useCaja";
import useToast from "../../../hooks/alertMessage/useToast";
import { useAperturaCierreCaja } from "../../../hooks/useAperturaCierreCaja";
import { StorageService } from "../../../utils/storageService";
import values from "../../../models/clases/values";

interface AperturaCajaProps {
  onAperturaExitosa: (idApertura: number) => void;
}

const AperturaCaja: React.FC<AperturaCajaProps> = ({ onAperturaExitosa }) => {
  const [cajaSeleccionada, setCajaSeleccionada] = useState<string>("");
  const [turnoSeleccionado, setTurnoSeleccionado] = useState<string>("");
  const [montoApertura, setMontoApertura] = useState<string>("");
  const [cajas, setCajas] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const usuario = StorageService.getItem(values.storage.keySession);
  const { aperturarCaja } = useAperturaCierreCaja();
  const { obtenerCajas, LoadingComponent } = useCaja();
  const { showToast, ToastComponent } = useToast();

  const handleAperturar = async () => {
    if (!cajaSeleccionada || !turnoSeleccionado || !montoApertura) {
      showToast("Complete todos los campos", 3000, "warning");
      return;
    }

    setLoading(true); // ⏳ Inicia carga

    const now = new Date();
    const fecha = now.toISOString().slice(0, 10);
    const hora = now.toTimeString().slice(0, 8);

    const aperturaData = {
      caja_id: Number(cajaSeleccionada),
      turno_id: Number(turnoSeleccionado),
      fecha_aper: fecha,
      hora_aper: hora,
      monto_aper: parseFloat(montoApertura),
      estado: 1,
      fecha_creacion: fecha,
      hora_creacion: hora,
    };

    try {
      const res = await aperturarCaja(aperturaData);

      if (res.data.objeto === false) {
        showToast(
          res.data.descripcion || "No se pudo aperturar la caja",
          3000,
          "danger"
        );
        return;
      }

      showToast(
        res.data.descripcion || "Caja aperturada correctamente",
        3000,
        "success"
      );
      const aperturaId = res.data.objeto?.id;
      if (aperturaId) {
        onAperturaExitosa(aperturaId);
      }
    } catch (error: any) {
      console.error("Error en aperturarCaja:", error.message);
      showToast("Error al aperturar la caja", 3000, "danger");
    } finally {
      setLoading(false); // ✅ Finaliza carga
    }
  };

  useEffect(() => {
    const fetchCajas = async () => {
      try {
        console.log("USUARIO",usuario.objeto.idPerfil);
        
        const perfil = usuario.objeto.idPerfil;
        const res = await obtenerCajas(perfil);
        if (res.data.objeto) {
          const cajasActivas = res.data.objeto.filter(
            (caja: any) => caja.estado === 0
          );

          if (cajasActivas.length > 0) {
            setCajas(cajasActivas);
          } else {
            showToast("No hay cajas activas", 3000, "warning");
          }
        } else {
          showToast("No se encontraron cajas", 3000, "warning");
        }
      } catch {
        showToast("Error al cargar las cajas", 3000, "danger");
      }
    };

    fetchCajas();
  }, []);

  return (
    <div className="apertura-container">
      {ToastComponent}
      {ToastComponent}
      <IonCard className="apertura-card">
        <IonCardContent>
          <IonGrid>
            <IonRow>
              <IonCol size="4" className="apertura-col-icon">
                <IonIcon icon={lockClosedOutline} className="apertura-icon" />
                <div className="apertura-cinta">CERRADO</div>
                <div className="apertura-subtitulo">
                  Ingrese los datos,
                  <br /> para abrir una caja
                </div>
              </IonCol>

              <IonCol size="8">
                <IonItem>
                  <IonLabel position="stacked">Caja</IonLabel>
                  <IonSelect
                    placeholder="Seleccione una caja"
                    value={cajaSeleccionada}
                    onIonChange={(e) => setCajaSeleccionada(e.detail.value)}
                    disabled={loading}
                  >
                    {cajas.map((caja) => (
                      <IonSelectOption key={caja.id} value={caja.id}>
                        {caja.descripcion}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Turno</IonLabel>
                  <IonSelect
                    placeholder="Seleccione un turno"
                    value={turnoSeleccionado}
                    onIonChange={(e) => setTurnoSeleccionado(e.detail.value)}
                    disabled={loading}
                  >
                    <IonSelectOption value="1">Mañana</IonSelectOption>
                    <IonSelectOption value="2">Tarde</IonSelectOption>
                    <IonSelectOption value="3">Noche</IonSelectOption>
                  </IonSelect>
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Monto de Apertura</IonLabel>
                  <IonInput
                    type="number"
                    value={montoApertura}
                    placeholder="Ingrese monto"
                    onIonInput={(e) => setMontoApertura(e.detail.value!)}
                    disabled={loading}
                  />
                </IonItem>

                <div className="ion-padding-top">
                  <IonButton
                    expand="block"
                    color="success"
                    onClick={handleAperturar}
                    disabled={loading}
                  >
                    {loading ? <IonSpinner name="dots" /> : "Aperturar Caja"}
                  </IonButton>
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCardContent>
      </IonCard>
    </div>
  );
};

export default AperturaCaja;
