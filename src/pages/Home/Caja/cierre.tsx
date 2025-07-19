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
  IonSpinner,
  IonModal,
  IonContent,
  IonAlert,
} from "@ionic/react";
import { lockOpenOutline, checkmarkCircleOutline } from "ionicons/icons";
import "./cierre.css";
import useToast from "../../../hooks/alertMessage/useToast";
import { useAperturaCierreCaja } from "../../../hooks/useAperturaCierreCaja";

interface CierreCajaProps {
  aperturaId: number;
  onCierreExitosa: () => void;
}

const CierreCaja: React.FC<CierreCajaProps> = ({
  onCierreExitosa,
  aperturaId,
}) => {
  const [montoCajero, setMontoCajero] = useState<{ [key: number]: number }>({});
  const [montosSistema, setMontosSistema] = useState<{ [key: number]: number }>(
    {}
  );
  const [nombresMetodos, setNombresMetodos] = useState<{
    [key: number]: string;
  }>({});
  const [totalSistema, setTotalSistema] = useState<number>(0);
  const [totalCajero, setTotalCajero] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [loadingInicial, setLoadingInicial] = useState(true);
  const [loadingSistema, setLoadingSistema] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [cerradoExitoso, setCerradoExitoso] = useState(false);
  const [showDiferenciaAlert, setShowDiferenciaAlert] = useState(false);
  const [loadingArqueo, setLoadingArqueo] = useState(false);

  const { cerrarCaja, obtenerMontosCaja, arqueoCaja } = useAperturaCierreCaja();
  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    obtenerSoloMetodosPagoInicial();
  }, []);

  const obtenerSoloMetodosPagoInicial = async () => {
    try {
      const res = await obtenerMontosCaja(aperturaId, 1);
      const metodos = res?.data?.objeto?.metodosUsados || [];
      if (!metodos.length) throw new Error("No hay métodos disponibles");

      const nombres = metodos.reduce((acc: any, m: any) => {
        acc[m.metodo_pago_id] = m.nombre;
        return acc;
      }, {});
      setNombresMetodos(nombres);
    } catch {
      showToast("No se pudo obtener los métodos de pago", 3000, "danger");
    } finally {
      setLoadingInicial(false);
    }
  };

  const obtenerMontosSistemaFinal = async () => {
    try {
      setLoadingSistema(true);
      const res = await obtenerMontosCaja(aperturaId);
      const sistema = res?.data?.objeto;
      if (!sistema) throw new Error("Error al obtener montos");

      const sistemaMontos = sistema.totalesPorMetodo.reduce(
        (acc: any, m: any) => {
          acc[m.metodo_pago_id] = m.total;
          return acc;
        },
        {}
      );

      const nombres = sistema.totalesPorMetodo.reduce((acc: any, m: any) => {
        acc[m.metodo_pago_id] = m.nombre;
        return acc;
      }, {});

      setMontosSistema(sistemaMontos);
      setNombresMetodos(nombres);
      setTotalSistema(sistema.totalMontoSistema);
      return true;
    } catch {
      showToast("No se pudo obtener los montos del sistema", 3000, "danger");
      return false;
    } finally {
      setLoadingSistema(false);
    }
  };

  const handleCerrar = async () => {
    const ok = await obtenerMontosSistemaFinal();
    if (!ok) return;

    const total = Object.values(montoCajero).reduce((a, v) => a + (v || 0), 0);
    setTotalCajero(total);
    setShowConfirmModal(true);
  };

  const confirmarCierre = async () => {
    if (totalSistema !== totalCajero && !showDiferenciaAlert) {
      setShowDiferenciaAlert(true);
      return;
    }

    setLoading(true);
    const now = new Date();
    const cierreData = {
      id: aperturaId,
      monto_cierre: totalCajero,
      monto_sistema: totalSistema,
      fecha_cierre: now.toISOString().slice(0, 10),
      hora_cierre: now.toTimeString().slice(0, 8),
      estado: 2,
      detallesCierreCaja: Object.entries(montoCajero)
        .filter(([, monto]) => Number(monto) > 0) // opcional: solo montos > 0
        .map(([id, monto]) => ({
          metodo_pago_id: Number(id),
          monto: Number(monto),
        })),
    };

    // console.log(cierreData);

    // return ;

    try {
      const res = await cerrarCaja(cierreData);
      if (!res?.data?.objeto) throw new Error("Error al cerrar caja");
      showToast("Caja cerrada correctamente", 3000, "success");
      setCerradoExitoso(true);
    } catch {
      showToast("Error al cerrar la caja", 3000, "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerarArqueo = async () => {
    setLoadingArqueo(true);
    try {
      const res = await arqueoCaja(aperturaId);
      const base64PDF = res.data.objeto?.pdfArqueo;

      if (!base64PDF) {
        showToast("No se pudo generar el PDF de arqueo", 3000, "danger");
        return;
      }

      // Abrir el PDF en nueva pestaña
      const pdfWindow = window.open();
      if (pdfWindow) {
        pdfWindow.document.write(
          `<iframe width='100%' height='100%' src='data:application/pdf;base64,${base64PDF}'></iframe>`
        );
      } else {
        showToast("No se pudo abrir el PDF", 3000, "danger");
      }
      // Cerrar modal y continuar
      setShowConfirmModal(false);
      onCierreExitosa();
    } catch (error) {
      console.error("Error al generar arqueo:", error);
      showToast("Error al generar el arqueo", 3000, "danger");
    }
  };

  return (
    <div className="cierre-container">
      {ToastComponent}
      <IonCard className="cierre-card">
        <IonCardContent>
          <IonGrid>
            <IonRow>
              <IonCol size="4" className="ion-text-center">
                <IonIcon
                  icon={lockOpenOutline}
                  style={{ fontSize: "5rem", color: "#4caf50" }}
                />
                <div className="estado-label">ABIERTO</div>
                <div style={{ color: "#333", fontSize: "0.9rem" }}>
                  Ingrese montos por método
                </div>
              </IonCol>
              <IonCol size="8">
                {loadingInicial ? (
                  <div className="ion-text-center">
                    <IonSpinner name="crescent" />
                    <p>Cargando métodos de pago...</p>
                  </div>
                ) : (
                  Object.keys(nombresMetodos).map((id) => (
                    <IonItem key={id}>
                      <IonLabel position="stacked">
                        {nombresMetodos[+id]}
                      </IonLabel>
                      <IonInput
                        type="number"
                        value={montoCajero[+id] || ""}
                        onIonInput={(e) => {
                          const value = parseFloat(e.detail.value!);
                          setMontoCajero((prev) => ({
                            ...prev,
                            [+id]: isNaN(value) ? 0 : value,
                          }));
                        }}
                        disabled={loading}
                      />
                    </IonItem>
                  ))
                )}
                <div className="ion-padding-top">
                  <IonButton
                    expand="block"
                    color="danger"
                    onClick={handleCerrar}
                    disabled={loading || loadingInicial || loadingSistema}
                  >
                    {loadingSistema ? (
                      <IonSpinner name="dots" />
                    ) : (
                      "Cerrar Caja"
                    )}
                  </IonButton>
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCardContent>
      </IonCard>

      <IonModal
        isOpen={showConfirmModal}
        backdropDismiss={false}
        className="modal-cierre-custom"
      >
        <IonContent className="ion-padding modal-cierre-content">
          <div
            className="ion-text-center"
            style={{ maxWidth: "300px", margin: "auto" }}
          >
            {!cerradoExitoso ? (
              <>
                <h2>Montos del Sistema</h2>
                {Object.entries(montosSistema).map(([id, total]) => (
                  <IonItem key={id} lines="none">
                    <IonLabel>{nombresMetodos[+id]}</IonLabel>
                    <div style={{ marginLeft: "auto" }}>
                      S/ {total.toFixed(2)}
                    </div>
                  </IonItem>
                ))}
                <IonItem lines="full">
                  <IonLabel>Total Sistema</IonLabel>
                  <div style={{ marginLeft: "auto" }}>
                    S/ {totalSistema.toFixed(2)}
                  </div>
                </IonItem>
                <h2 style={{ marginTop: "1rem" }}>Montos del Cajero</h2>
                {Object.entries(montoCajero).map(([id, total]) => (
                  <IonItem key={id} lines="none">
                    <IonLabel>{nombresMetodos[+id]}</IonLabel>
                    <div style={{ marginLeft: "auto" }}>
                      S/ {Number(total).toFixed(2)}
                    </div>
                  </IonItem>
                ))}
                <IonItem lines="full">
                  <IonLabel>Total Cajero</IonLabel>
                  <div style={{ marginLeft: "auto" }}>
                    S/ {totalCajero.toFixed(2)}
                  </div>
                </IonItem>
                <IonButton
                  expand="block"
                  color="success"
                  onClick={confirmarCierre}
                  disabled={loading}
                >
                  {loading ? <IonSpinner name="dots" /> : "Confirmar Cierre"}
                </IonButton>
                <IonButton
                  expand="block"
                  fill="outline"
                  onClick={() => setShowConfirmModal(false)}
                  disabled={loading}
                >
                  Cancelar
                </IonButton>
              </>
            ) : (
              <>
                <IonIcon
                  icon={checkmarkCircleOutline}
                  style={{
                    fontSize: "3rem",
                    color: "#4caf50",
                    marginBottom: "1rem",
                  }}
                />
                <h2 style={{ fontSize: "1.2rem" }}>¡Caja cerrada!</h2>
                <p style={{ fontSize: "0.95rem" }}>
                  La caja se cerró correctamente.
                </p>
                <IonButton
                  expand="block"
                  color="success"
                  onClick={handleGenerarArqueo}
                  disabled={loadingArqueo}
                >
                  {loadingArqueo ? (
                    <IonSpinner name="dots" />
                  ) : (
                    "Generar Arqueo"
                  )}
                </IonButton>
                <IonButton
                  expand="block"
                  fill="outline"
                  onClick={() => {
                    setShowConfirmModal(false);
                    onCierreExitosa();
                  }}
                >
                  Aceptar
                </IonButton>
              </>
            )}
          </div>
        </IonContent>
      </IonModal>

      <IonAlert
        isOpen={showDiferenciaAlert}
        header="Montos diferentes"
        message="Los montos del sistema y los del cajero no coinciden. ¿Desea continuar?"
        buttons={[
          {
            text: "Cancelar",
            role: "cancel",
            handler: () => setShowDiferenciaAlert(false),
          },
          {
            text: "Sí, continuar",
            handler: () => {
              setShowDiferenciaAlert(false);
              confirmarCierre();
            },
          },
        ]}
      />
    </div>
  );
};

export default CierreCaja;
