import React, { useState, useEffect } from "react";
import {
  IonGrid,
  IonRow,
  IonCol,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonIcon,
  IonSpinner,
} from "@ionic/react";
import { calendarOutline, timeOutline } from "ionicons/icons";
import RangoFechas from "../../../../../components/compartidos/RangoFechas";
import TablaPersonalizada from "../../../../../components/compartidos/TablaPersonalizada";
import { obtenerFechasPeruanas } from "../../../../../utils/fechas";
import CustomButton from "../../../../../components/compartidos/CustomButton";
import { useInsumo } from "../../../../../hooks/useInsumo";
import { useProducto } from "../../../../../hooks/useProducto";
import useToast from "../../../../../hooks/alertMessage/useToast";
import {
  TipoProducto,
  TiposProcesos,
} from "../../../../../models/clases/concepts";
import { useStockProducto } from "../../../../../hooks/useStockProducto";
import CartTotales from "../../../../../components/compartidos/cartTotales";
import {
  Buscador,
  ResultadoItem,
} from "../../../../../components/compartidos/BuscadorList";

const StockMovimientoProducto: React.FC = () => {
  const { fechaInicioGlobal, fechaFinGlobal, fechaHoyGlobal } =
    obtenerFechasPeruanas(7);
  const [fechaInicio, setFechaInicio] = useState(fechaInicioGlobal);
  const [fechaFin, setFechaFin] = useState(fechaFinGlobal);
  const [fechaHoy] = useState(fechaHoyGlobal);
  const [tipo, setTipo] = useState<"Producto" | "Insumo">("Producto");
  const [productoSeleccionado, setProductoSeleccionado] = useState<number>(0);
  const [presentacionSeleccionada, setPresentacionSeleccionada] =
    useState<number>(0);
  const [stockProductos, setStockProductos] = useState<any[]>([]);
  const [loadingTabla, setLoadingTabla] = useState(false);
  const [textoBusqueda, setTextoBusqueda] = useState("");

  const [stockResumen, setStockResumen] = useState({
    inicial: 0,
    entradas: 0,
    salidas: 0,
    final: 0,
  });
  const [busquedaEjecutada, setBusquedaEjecutada] = useState(false);

  const { obtenerPresentacionesTexto } = useProducto();
  const { obtenerStockProducto } = useStockProducto();
  const { obtenerInsumos } = useInsumo();
  const { showToast, ToastComponent } = useToast();

  const esProducto = tipo === "Producto";

  useEffect(() => {
    if (
      (esProducto && presentacionSeleccionada) ||
      (!esProducto && productoSeleccionado)
    ) {
      consultarMovimientoStock();
    }
  }, [
    fechaInicio,
    fechaFin,
    presentacionSeleccionada,
    productoSeleccionado,
    esProducto,
  ]);

  const consultarMovimientoStock = async () => {
    if (esProducto && !presentacionSeleccionada) {
      showToast("Debe ingresar un producto en la búsqueda", 3000, "warning");
      return;
    }
    if (!esProducto && !productoSeleccionado) {
      showToast("Debe ingresar un insumo en la búsqueda", 3000, "warning");
      return;
    }

    setLoadingTabla(true);
    setBusquedaEjecutada(true);

    try {
      const response = await obtenerStockProducto({
        producto_presentacion_id: esProducto ? presentacionSeleccionada : null,
        insumo_id: !esProducto ? productoSeleccionado : null,
        fechaInicio,
        fechaFin,
      });

      const movimientosTodos = response.data.objeto || [];
      const movimientosDentroRango = movimientosTodos.filter(
        (item: any) => item.fecha_operacion >= fechaInicio
      );
      const registroAntesRango = movimientosTodos.find(
        (item: any) => item.fecha_operacion < fechaInicio
      );

      const stockInicial = registroAntesRango?.stock_actual || 0;
      const movimientos = movimientosDentroRango.map(mapearMovimiento);

      const entradas = movimientos.reduce(
        (acc: any, item: any) => acc + (parseFloat(item.entrada) || 0),
        0
      );
      const salidas = movimientos.reduce(
        (acc: any, item: any) => acc + (parseFloat(item.salida) || 0),
        0
      );
      const stockFinal = movimientos.length
        ? parseFloat(movimientos.at(-1)?.cantidad) || 0
        : stockInicial;

      setStockProductos(movimientos);
      setStockResumen({
        inicial: stockInicial,
        entradas,
        salidas,
        final: stockFinal,
      });
    } catch {
      showToast("Error al consultar el stock");
    } finally {
      setLoadingTabla(false);
    }
  };

  const mapearMovimiento = (item: any) => ({
    id: item.id,
    fecha: item.fecha_operacion,
    hora: item.hora_operacion,
    concepto: TiposProcesos[item.tipo_proceso] || "Otro",
    codigo_transaccion: item.codigo_transaccion ?? "-",
    entrada: item.tipo_movimiento === 1 ? item.cantidad : "",
    salida: item.tipo_movimiento === 2 ? item.cantidad : "",
    cantidad: item.stock_actual,
  });

  const buscarTodo = async (texto: string): Promise<ResultadoItem[]> => {
    const textoLimpio = texto.trim();
    if (!textoLimpio) return [];

    try {
      const [respInsumos, respPresentaciones] = await Promise.all([
        obtenerInsumos({ texto }),
        obtenerPresentacionesTexto(texto, TipoProducto.Almacenado),
      ]);

      const insumos = (respInsumos?.data?.objeto || []).map((insumo: any) => ({
        tipo: "insumo",
        id: insumo.id,
        unidad: insumo.unidad_medida,
        nombre: insumo.nombre,
        codigo: insumo.codigo,
      }));

      const presentaciones = (respPresentaciones?.data?.objeto || []).map(
        (p: any) => ({
          tipo: "presentacion",
          id: p.idPresentacion,
          nombre: p.descripcion,
          codigo: p.codigoPresentacion,
        })
      );

      return [...insumos, ...presentaciones];
    } catch (error) {
      console.error("Error en búsqueda:", error);
      return [];
    }
  };

  const onSeleccionarItem = (item: ResultadoItem) => {
    setTextoBusqueda(item.nombre); // <-- nuevo
    if (item.tipo === "presentacion") {
      setTipo("Producto");
      setPresentacionSeleccionada(item.id);
      setProductoSeleccionado(0);
    } else {
      setTipo("Insumo");
      setProductoSeleccionado(item.id);
      setPresentacionSeleccionada(0);
    }
    setBusquedaEjecutada(false);
  };

  const columns = [
    {
      name: "Fecha",
      cell: (row: any) => (
        <div>
          <IonLabel>
            <IonIcon icon={calendarOutline} style={{ marginRight: "6px" }} />
            {row.fecha}
          </IonLabel>
          <br />
          <IonLabel>
            <IonIcon icon={timeOutline} style={{ marginRight: "6px" }} />
            {row.hora}
          </IonLabel>
        </div>
      ),
    },
    {
      name: "Código",
      selector: (row: any) => row.codigo_transaccion,
      sortable: true,
    },
    {
      name: "Concepto",
      cell: (row: any) => (
        <div
          style={{
            background: "#f1f1f1",
            borderRadius: 4,
            display: "inline-block",
            padding: "2px 6px",
            fontSize: "12px",
          }}
        >
          {row.concepto}
        </div>
      ),
    },
    {
      name: "Entrada",
      cell: (row: any) => (
        <span style={{ color: "green", fontWeight: 500 }}>
          {row.entrada || "-"}
        </span>
      ),
    },
    {
      name: "Salida",
      cell: (row: any) => (
        <span style={{ color: "red", fontWeight: 500 }}>
          {row.salida || "-"}
        </span>
      ),
    },
    {
      name: "Stock Actual",
      selector: (row: any) => row.cantidad,
    },
  ];

  return (
    <div className="scroll-horizontal-informes">
      <div>
          <h1 style={{textAlign: 'center', fontWeight: 'bold'}}>MOVIMIENTO DE STOCK</h1>
      </div>
      <IonGrid>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "12px",
          }}
        >
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
              <CustomButton
                text="Buscar"
                onClick={consultarMovimientoStock}
                expand="full"
              />
            </div>
          </div>

          <div style={{ flex: "1 1 220px" }}>
            <IonLabel>Buscar producto o insumo</IonLabel>
            <Buscador
              buscar={buscarTodo}
              placeholder={
                textoBusqueda
                  ? `📦 ${textoBusqueda}`
                  : "Buscar nombre de producto o insumo"
              }
              onSeleccionar={onSeleccionarItem}
            />
          </div>
        </div>

        <IonRow>
          {[
            {
              label: "Stock inicial",
              value: stockResumen.inicial,
              color: "#a0a0a0",
            },
            {
              label: "Cantidad de entradas",
              value: stockResumen.entradas,
              color: "#2dd36f",
            },
            {
              label: "Cantidad de salidas",
              value: stockResumen.salidas,
              color: "#eb445a",
            },
            {
              label: "Stock final",
              value: stockResumen.final,
              color: "#3880ff",
            },
          ].map((item, i) => (
            <IonCol key={i} size="12" sizeMd="3">
              <CartTotales
                color={item.color}
                descripcion={item.label}
                numero={item.value}
              />
            </IonCol>
          ))}
        </IonRow>
      </IonGrid>

      {loadingTabla ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <IonSpinner name="crescent" />
        </div>
      ) : busquedaEjecutada ? (
          <TablaPersonalizada
            columns={columns}
            data={stockProductos}
            noDataComponent={
              <div style={{ padding: "1rem", textAlign: "center" }}>
                No se encontraron datos
              </div>
            }
            // showFilter
            // filterPlaceholder="Buscar"
            // filterFunction={(item: any, texto) =>
            //   (item.concepto ?? "").toLowerCase().includes(texto.toLowerCase())
            // }
          />
      ) : (
        <div style={{ padding: "1rem", textAlign: "center", color: "#666" }}>
          Realice una búsqueda para ver resultados
        </div>
      )}

      {ToastComponent}
    </div>
  );
};

export default StockMovimientoProducto;
