import React, { useState, useEffect } from "react";
import {
  IonGrid,
  IonLabel,
  IonSpinner,
} from "@ionic/react";
import RangoFechas from "../../../../../components/compartidos/RangoFechas";
import TablaPersonalizada from "../../../../../components/compartidos/TablaPersonalizada";
import { obtenerFechasPeruanas } from "../../../../../utils/fechas";
import { useProducto } from "../../../../../hooks/useProducto";
import { ProductoPresentacion } from "../../../../../models/clases/Producto";
import CustomButton from "../../../../../components/compartidos/CustomButton";
import useToast from "../../../../../hooks/alertMessage/useToast";
import { useGanancias } from "../../../../../hooks/useGanacias";
import { useResumenGanancia } from "../../../../../hooks/useCalcularTotales";
import "./ganacias.css";
import "../informes.css";
import CartTotales from "../../../../../components/compartidos/cartTotales";
import { Buscador, ResultadoItem } from "../../../../../components/compartidos/BuscadorList";
import { TipoProducto } from "../../../../../models/clases/concepts";

const formatearMoneda = (valor: number | undefined) => `S/ ${(valor ?? 0).toFixed(2)}`;

const columnasGanancia = [
  { name: "Descripción", selector: (row: any) => row.descripcion },
  { name: "Cantidad Vendida", selector: (row: any) => row.cantidad_total_vendida },
  { name: "Costo Unitario", selector: (row: any) => formatearMoneda(row.costo_unitario_promedio) },
  { name: "Costo Total", selector: (row: any) => formatearMoneda(row.costo_total) },
  { name: "Precio Venta", selector: (row: any) => formatearMoneda(row.precio_venta_unitario) },
  { name: "Total Vendido", selector: (row: any) => formatearMoneda(row.total_vendido) },
  { name: "Margen Unitario", selector: (row: any) => formatearMoneda(row.margen_unitario) },
  { name: "Margen Total", selector: (row: any) => formatearMoneda(row.margen_ganancia_total) },
];

const Ganancia: React.FC = () => {
  const { fechaInicioGlobal, fechaFinGlobal, fechaHoyGlobal } = obtenerFechasPeruanas(7);
  const [fechaInicio, setFechaInicio] = useState(fechaInicioGlobal);
  const [fechaFin, setFechaFin] = useState(fechaFinGlobal);
  const [fechaHoy] = useState(fechaHoyGlobal);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [presentacionSeleccionada, setPresentacionSeleccionada] = useState("");
  const [datosGanancia, setDatosGanancia] = useState<any[]>([]);
  const [loadingTabla, setLoadingTabla] = useState(false);

  const [resumen, setResumen] = useState({
    cantidadVendida: 0,
    costoTotal: 0,
    cortesiaCombos: 0,
    margenTotal: 0,
    gananciaTotal: 0,
  });

  const { obtenerPresentacionesTexto } = useProducto();
  const { obtenerGanancias } = useGanancias();
  const { showToast, ToastComponent } = useToast();
  const { calcularResumenGanancia } = useResumenGanancia();

  useEffect(() => {
    consultarGanancias();
  }, []);

  useEffect(() => {
    consultarGanancias();
  }, [presentacionSeleccionada]);

  const consultarGanancias = async () => {
    try {
      setLoadingTabla(true);
      const response = await obtenerGanancias({
        producto_presentacion_id: presentacionSeleccionada
          ? Number(presentacionSeleccionada)
          : undefined,
        fechaInicio,
        fechaFin,
      });
      const lista = response.data.objeto ?? [];
      setDatosGanancia(lista);
      setResumen(calcularResumenGanancia(lista));
      showToast("🔍 Consulta de ganancias completada");
    } catch {
      showToast("Error al obtener ganancias");
    } finally {
      setLoadingTabla(false);
    }
  };

  const buscarTodo = async (texto: string): Promise<ResultadoItem[]> => {
    const textoLimpio = texto.trim();
    if (!textoLimpio) return [];

    try {
      const resp = await obtenerPresentacionesTexto(texto, TipoProducto.Almacenado);
      return (resp?.data?.objeto || []).map((p: any) => ({
        tipo: "presentacion",
        id: p.idPresentacion,
        nombre: p.descripcion,
        codigo: p.codigoPresentacion,
      }));
    } catch (error) {
      console.error("Error en búsqueda:", error);
      return [];
    }
  };

  return (
    <div className="scroll-horizontal-informes">
      <div>
          <h1 style={{textAlign: 'center', fontWeight: 'bold'}}>GANANCIAS</h1>
      </div>
      <IonGrid>
        {/* Filtros */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "12px" }}>
          <div>
            <IonLabel>Rango de fechas</IonLabel>
            <div className="div-rango-fechas">
              <RangoFechas
                fechaHoy={fechaHoy}
                fechaInicio={fechaInicio}
                fechaFin={fechaFin}
                meses={2}
                onChange={({ startDate, endDate }) => {
                  setFechaInicio(startDate);
                  setFechaFin(endDate);
                }}
              />
              <CustomButton text="BUSCAR" onClick={consultarGanancias} />
            </div>
          </div>

          <div style={{ flex: "1 1 220px" }}>
            <IonLabel>Buscar producto o insumo</IonLabel>
            <Buscador
              buscar={buscarTodo}
              placeholder={
                textoBusqueda ? `📦 ${textoBusqueda}` : "Buscar producto o insumo"
              }
              onSeleccionar={(item) => {
                setPresentacionSeleccionada(item.id.toString());
                setTextoBusqueda(item.nombre);
              }}
            />
          </div>
        </div>

        {/* Resumen */}
        <div className="resumen-ganancia" style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {[
            { label: "Cantidad vendida", valor: resumen.cantidadVendida, color: "#3880ff" },
            { label: "Cortesía / Combos", valor: resumen.cortesiaCombos, color: "#a0a0a0" },
            { label: "Margen Total", valor: resumen.margenTotal, color: "#10dc60" },
            { label: "Ganancia Total", valor: resumen.gananciaTotal, color: "#2dd36f" },
          ].map((item, i) => (
            <div key={i} style={{ flex: "1 1 180px" }}>
              <CartTotales color={item.color} descripcion={item.label} numero={item.valor} />
            </div>
          ))}
        </div>

        {/* Tabla */}
        {loadingTabla ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <IonSpinner name="crescent" />
          </div>
        ) : (
          <TablaPersonalizada
            columns={columnasGanancia}
            data={datosGanancia}
            noDataComponent={
              <div style={{ textAlign: "center", padding: "1rem" }}>
                No se encontraron datos
              </div>
            }
            // showFilter
            // filterPlaceholder="Buscar"
            // filterFunction={(item: any, texto) =>
            //   (item.descripcion ?? "").toLowerCase().includes(texto.toLowerCase())
            // }
          />
        )}
      </IonGrid>
      {ToastComponent}
    </div>
  );
};

export default Ganancia;
