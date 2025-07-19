import React, { useCallback, useEffect, useState } from "react";
import {
  IonPage,
  IonContent,
  IonButton,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonBadge,
} from "@ionic/react";
import { cogOutline } from "ionicons/icons";
import axios from "axios";
import "./Cocina.css";
import API_BASE_URL from "../../../../config/apiConfig";
import { getAuthHeaders } from "../../../../utils/authHeaders";
import { usePreparaciones } from "../../../../hooks/usePreparacion";
import useToast from "../../../../hooks/alertMessage/useToast";
import { useSocketEvent } from "../../../../hooks/useSocketEvent";
import { SOCKET_EVENTS } from "../../../../models/clases/socketEvents";
import { Preparacion } from "../../../../models/clases/Preparacion";

const Cocina: React.FC = () => {
  const [preparaciones, setPreparaciones] = useState<Preparacion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { actualizarPreparacion, obtenerPreparaciones } = usePreparaciones();
  const { showToast, ToastComponent } = useToast();
  const [vistaEstado, setVistaEstado] = useState<1 | 2 | 3 | 5>(1);

  const fetchPreparaciones = useCallback(async () => {
    setLoading(true);
    try {
      const fechaActual = new Date().toISOString().split("T")[0]; // AAAA-MM-DD
      const response = await obtenerPreparaciones(fechaActual); // ahora acepta fecha
      console.log("Preparaciones:", response.data);
      setPreparaciones(response.data.objeto);
    } catch (error) {
      console.error("Error al obtener preparaciones", error);
      setError("Error al obtener preparaciones");
    } finally {
      setLoading(false);
    }
  }, []);

  useSocketEvent(SOCKET_EVENTS.PEDIDO_ACTUALIZADO_MESA, (data) => {
    console.log("Evento recibido:", data);
    fetchPreparaciones();
  });

  useSocketEvent(SOCKET_EVENTS.PREPARACION_ACTUALIZADA, (data) => {
    console.log("Evento recibido:", data);
    fetchPreparaciones();
  });

  useEffect(() => {
    fetchPreparaciones();
  }, [fetchPreparaciones]);

  const manejarCambioEstado = async (id: number, estadoActual: number) => {
    const nuevoEstado =
      estadoActual === 1 ? 2 : estadoActual === 2 ? 3 : estadoActual;
    try {
      await actualizarPreparacion({ id, estado: nuevoEstado });
      setPreparaciones((prev) =>
        prev.map((p) => (p.id === id ? { ...p, estado: nuevoEstado } : p))
      );
    } catch (err) {
      console.error("Error al actualizar estado", err);
    }
  };

  const TiempoTranscurrido = ({ fechaHoraInicial, }: { fechaHoraInicial: string;}) => {
    const [minutos, setMinutos] = useState(0);

    useEffect(() => {
      const calcularMinutos = () => {
        const [horaInicial, minutoInicial] = fechaHoraInicial.split(":").map(Number);
        const ahora = new Date();
        const horaActual = ahora.getHours();
        const minutoActual = ahora.getMinutes();

        const totalMinutosInicial = horaInicial * 60 + minutoInicial;
        const totalMinutosActual = horaActual * 60 + minutoActual;

        const diferencia = totalMinutosActual - totalMinutosInicial;
        setMinutos(diferencia >= 0 ? diferencia : 0);
      };

      calcularMinutos();
      const interval = setInterval(calcularMinutos, 60000); // Actualiza cada minuto
      return () => clearInterval(interval);
    }, [fechaHoraInicial]);

    return (
      <IonCol>
        <span className="span-tiempo">
          {minutos} minuto{minutos !== 1 && "s"}
        </span>
      </IonCol>
    );
  };

  const preparacionesPorEstado = (estado: number) =>
    preparaciones.filter((prep) => prep.estado === estado);
  const preparacionesFiltradas = preparacionesPorEstado(vistaEstado);

  return (
    <div className="div-cocina">
      {/* Tabs con badge */}
      <IonSegment
        value={String(vistaEstado)}
        onIonChange={(e) =>
          setVistaEstado(Number(e.detail.value) as 1 | 2 | 3 | 5)
        }
      >
        <IonSegmentButton value="1">
          <IonLabel>
            Por preparar
            {preparacionesPorEstado(1).length > 0 && (
              <IonBadge color="danger" style={{ marginLeft: "6px" }}>
                {preparacionesPorEstado(1).length}
              </IonBadge>
            )}
          </IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="2">
          <IonLabel>
            En preparación
            {preparacionesPorEstado(2).length > 0 && (
              <IonBadge color="warning" style={{ marginLeft: "6px" }}>
                {preparacionesPorEstado(2).length}
              </IonBadge>
            )}
          </IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="3">
          <IonLabel>
            Listos para servir
            {preparacionesPorEstado(3).length > 0 && (
              <IonBadge color="success" style={{ marginLeft: "6px" }}>
                {preparacionesPorEstado(3).length}
              </IonBadge>
            )}
          </IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="5">
          <IonLabel>
            Cancelados
            {preparacionesPorEstado(5).length > 0 && (
              <IonBadge color="danger" style={{ marginLeft: "6px" }}>
                {preparacionesPorEstado(5).length}
              </IonBadge>
            )}
          </IonLabel>
        </IonSegmentButton>
      </IonSegment>

      {/* Tabla scrollable */}
      <div className="scroll-container">
        <IonGrid className="tabla-produccion">
          {/* Cabecera */}
          <IonRow className="cabecera-tabla">
            <IonCol>Mesa</IonCol>
            <IonCol>Cantidad/Producto</IonCol>
            <IonCol>Tiempo</IonCol>
            <IonCol>Estado</IonCol>
            <IonCol>Mozo</IonCol>
            <IonCol>Acción</IonCol>
          </IonRow>

          {/* Filas dinámicas */}
          {loading ? (
            <p>Cargando preparaciones...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            preparacionesFiltradas.map((prep) => {
              const hora = prep.hora_creacion;

              return (
                <IonRow key={prep.id} className="row-tabla">
                  <IonCol>
                    <div>{prep.pedido.mesa?.nro_mesa || "SIN MESA"}</div>
                    <div>{prep.pedido.mesa?.salon?.nombre || "MOSTRADOR"}</div>
                  </IonCol>

                  <IonCol className="cantidad-tabla">
                    <div className="div-cantidad-producto">
                      <div>
                        <span className="span-unidad">{prep.cantidad} UNI</span>
                        <span>{prep.producto_presentacion.descripcion}</span>
                      </div>
                      {prep.comentario.trim() !== "" && (
                        <div style={{ marginTop: "5px" }}>
                          <span className="span-etiqueta-produccion-lista">
                            {prep.comentario}
                          </span>
                        </div>
                      )}
                    </div>
                  </IonCol>

                  <IonCol>
                    {(prep.estado === 3 || prep.estado === 5) ? (
                      <span className="span-tiempo">--:--:--</span>
                    ) : (
                      <TiempoTranscurrido fechaHoraInicial={hora} />
                    )}
                  </IonCol>


                  <IonCol>
                    {prep.estado === 1 && (
                      <span className="estado estado-registrado">
                        REGISTRADO
                      </span>
                    )}
                    {prep.estado === 2 && (
                      <span className="estado estado-en-preparacion">
                        EN PREPARACIÓN
                      </span>
                    )}
                    {prep.estado === 3 && (
                      <span className="estado estado-listo">
                        LISTO PARA SERVIR
                      </span>
                    )}
                    {prep.estado === 5 && (
                      <span className="estado estado-cancelado">CANCELADO</span>
                    )}
                  </IonCol>

                  <IonCol>{prep.usuario.persona.nombre}</IonCol>

                  <IonCol>
                    {prep.estado === 1 || prep.estado === 2 ? (
                      <IonButton
                        onClick={() =>
                          manejarCambioEstado(prep.id, prep.estado)
                        }
                      >
                        {prep.estado === 1 ? "Preparar" : "Terminar"}
                      </IonButton>
                    ) : (
                      <IonIcon className="icon-accion" icon={cogOutline} />
                    )}
                  </IonCol>
                </IonRow>
              );
            })
          )}
        </IonGrid>
      </div>
    </div>
  );
};

export default Cocina;
