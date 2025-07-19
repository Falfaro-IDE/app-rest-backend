import React, { useEffect, useState } from "react";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
  IonRow,
  IonSelect,
  IonSelectOption,
  useIonRouter,
} from "@ionic/react";
import {
  calendarOutline,
  eyeOutline,
  timeOutline,
} from "ionicons/icons";

import values from "../../../models/clases/values";
import { CompraDto, CompraRegistrarDto } from "../../../models/clases/Compra";
import useToast from "../../../hooks/alertMessage/useToast";
import { useCompra } from "../../../hooks/useCompra";
import { useConceptos } from "../../../hooks/useConceptos";
import { useProveedores } from "../../../hooks/useProveedor";
import TablaPersonalizada from "../../../components/compartidos/TablaPersonalizada";
import RangoFechas from "../../../components/compartidos/RangoFechas";
import CustomButton from "../../../components/compartidos/CustomButton";
import ReusableModal from "../../../components/compartidos/ReusableModal";
import { obtenerFechasPeruanas } from "../../../utils/fechas";
import './Compra.css';
import CartTotales from "../../../components/compartidos/cartTotales";

const Compra: React.FC = () => {
  const [listadoCompras, setComprasOriginales] = useState<CompraDto[]>([]);
  const [loadingCompras, setLoadingCompras] = useState(true);
  const [filtroProveedor, setFiltroProveedor] = useState("Todos");
  const [filtroComprobante, setFiltroComprobante] = useState("Todo");
  const [busqueda, setBusqueda] = useState("");
  const [compraSeleccionada, setCompraSeleccionada] = useState<CompraDto | null>(null);
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [listadoConceptosTipoCompra, setConceptosComprobante] = useState<any[]>([]);
  const [mostrarInformacion, setMostrarInformacion] = useState<boolean>(false);
  const [compraFiltros, setCompraFiltro] = useState<CompraRegistrarDto>({} as CompraRegistrarDto);

  const { showToast, ToastComponent } = useToast();
  const { obtenerCompras, LoadingComponent } = useCompra();
  const { obtenerConceptos } = useConceptos();
  const { obtenerProveedores } = useProveedores();
  const router = useIonRouter();

  const { fechaInicioGlobal, fechaFinGlobal, fechaHoyGlobal } = obtenerFechasPeruanas(7);
  const [fechaInicio, setFechaInicio] = useState<string>(fechaInicioGlobal);
  const [fechaFin, setFechaFin] = useState<string>(fechaFinGlobal);
  const [fechaHoy] = useState<string>(fechaHoyGlobal);

  const fetchCompras = async () => {
    try {
      const filtros = { ...compraFiltros, fechaInicio, fechaFin };
      const response = await obtenerCompras(filtros);
      setComprasOriginales(response?.data?.objeto || []);
      setMostrarInformacion(true);
    } catch {
      showToast("Error al cargar compras", 3000, "danger");
    } finally {
      setLoadingCompras(false);
    }
  };

  useEffect(() => {
    const fetchFiltros = async () => {
      try {
        const [conceptosResp, proveedoresResp] = await Promise.all([
          obtenerConceptos({ con_prefijo: 6 }),
          obtenerProveedores({})
        ]);
        setConceptosComprobante(conceptosResp?.data?.objeto || []);
        setProveedores(proveedoresResp?.data?.objeto || []);
      } catch {
        showToast("Error al cargar datos de compra", 3000, "danger");
      }
    };
    fetchFiltros();
    fetchCompras();
  }, []);

  const comprasFiltradas = listadoCompras.filter((c) => {
    const coincideProveedor = filtroProveedor === "Todos" || c.proveedor?.nombre === filtroProveedor;
    const coincideComprobante = filtroComprobante === "Todo" || c.documento === Number(filtroComprobante);
    const coincideBusqueda = (c.proveedor?.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ?? false)
      || c.numero.toLowerCase().includes(busqueda.toLowerCase())
      || c.serie.toLowerCase().includes(busqueda.toLowerCase());
    return coincideProveedor && coincideComprobante && coincideBusqueda;
  });

  const columns = [
    {
      name: "Fecha",
      cell: (row: any) => (
        <div>
          <div style={{ paddingBottom: 5 }}><IonIcon icon={calendarOutline} /> {row.fecha}</div>
          <div><IonIcon icon={timeOutline} /> {row.hora}</div>
        </div>
      ),
      sortable: true,
    },
    {
      name: "Documento",
      cell: (row: any) => (
        <div>
          <div>{`${row.serie} - ${row.numero}`}</div>
          <div style={{ fontSize: "0.85em", color: "#888", fontStyle: "italic" }}>{row.documentoDescripcion}</div>
        </div>
      ),
      sortable: true,
    },
    {
      name: "Tipo de Pago",
      selector: (row: any) => row.tipoDescripcion,
      sortable: true,
    },
    {
      name: "Proveedor",
      selector: (row: any) => row.proveedor?.nombre,
      sortable: true,
    },
    {
      name: "Responsable",
      selector: (row: any) => row.usuario?.persona?.nombre,
      sortable: true,
    },
    {
      name: "Estado",
      cell: (row: any) => (
        <span className={row.estado == 0 ? "estado-activo" : "estado-inactivo"}>
          {row.estado == 0 ? "Registrado" : row.estado}
        </span>
      ),
    },
    {
      name: "Acciones",
      cell: (row: any) => (
        <div className="tooltip-icon">
            <IonIcon
              onClick={() => setCompraSeleccionada(row)}
              slot="icon-only"
              className="tamanio-icon icono-ver"
              icon={eyeOutline}
            />
            <span className="tooltip-text">Ver detalle</span>
        </div>

      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const obtenerProveedoresDeCompras = () => {
    const nombresUnicos = new Set<string>();
    listadoCompras.forEach((c) => {
      if (c.proveedor?.nombre) nombresUnicos.add(c.proveedor.nombre);
    });
    return Array.from(nombresUnicos);
  };

  /* const obtenerComprobantesDeCompras = () => {
    const comprobantes: { correlativo: number; descripcion: string }[] = [];
    const vistos = new Set<number>();
    comprasFiltradas.forEach((c) => {
      if (c.documento !== undefined && !vistos.has(c.documento) && c.documentoDescripcion) {
        comprobantes.push({ correlativo: c.documento, descripcion: c.documentoDescripcion });
        vistos.add(c.documento);
      }
    });
    return comprobantes;
  };
 */

  const obtenerComprobantesDeCompras = (compras = listadoCompras) => {
    const comprobantesUnicos = new Map();
    compras.forEach((c) => {
      if (!comprobantesUnicos.has(c.documento)) {
        comprobantesUnicos.set(c.documento, {
          correlativo: c.documento,
          descripcion: c.documentoDescripcion // ajusta esto según cómo se llame tu campo
        });
      }
    });
    return Array.from(comprobantesUnicos.values());
  };

  return (
    <div className="scroll-horizontal-compras">
      {LoadingComponent}
      {ToastComponent}
      {/* Filtros */}
      <div>
          <h1 style={{textAlign: 'center', fontWeight: 'bold'}}>COMPRAS</h1>
      </div>
      <div>
        <div className="div-agregar-buscar">
          <div className="div-agregar">
            <IonButton
              onClick={() =>
                router.push(
                  values.rutas.rutas.homePrincipal.rutaPrincipal +
                    values.rutas.rutas.homePrincipal.compra.nuevacompra,
                  "forward"
                )
              }
              style={{ height: "fit-content" }}
              className="button-crear-compra"
            >
              + REGISTRAR COMPRA
            </IonButton>
          </div>
        </div>
        {/* <div className="div-filtros">
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
              <CustomButton text="Buscar" onClick={fetchCompras} expand="full" />
            </div>
          </div>
        </div> */}
        {/* <div>
          <div className="separador-filtros">

          </div>
        </div> */}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "12px" }}>
        <div className="div-rango-fechas-movil">
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
            <CustomButton text="Buscar" onClick={fetchCompras} expand="full" />
          </div>
        </div>

        {
          comprasFiltradas.length > 0 && (
            <div style={{ flex: "1 1 180px" }}>
              <label style={{ fontSize: "14px", marginBottom: "4px", display: "block" }}>Proveedor</label>
              <IonItem lines="none">
                <IonSelect value={filtroProveedor} onIonChange={(e) => setFiltroProveedor(e.detail.value)}>
                  <IonSelectOption value="Todos">Todos</IonSelectOption>
                  {obtenerProveedoresDeCompras().map((nombre) => (
                    <IonSelectOption key={nombre} value={nombre}>{nombre}</IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
            </div>
          )
        }

        {
          comprasFiltradas.length > 0 && (
            <div style={{ flex: "1 1 180px" }}>
              <label style={{ fontSize: "14px", marginBottom: "4px", display: "block" }}>Tipo de comprobante</label>
              <IonItem lines="none">
                <IonSelect value={filtroComprobante} onIonChange={(e) => setFiltroComprobante(e.detail.value)}>
                  <IonSelectOption value="Todo">Todo</IonSelectOption>
                  {obtenerComprobantesDeCompras(listadoCompras).map((c) => (
                    <IonSelectOption key={c.correlativo} value={c.correlativo}>{c.descripcion}</IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
            </div>
          )
        }

      </div>

      {/* Resumen */}
    <div className="resumen-compras" style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
      {[
        { label: "Comprobantes", valor: comprasFiltradas.length, color: "#a0a0a0" },
        { label: "Total compras", valor: parseFloat(comprasFiltradas.reduce((sum, c) => sum + c.total, 0).toFixed(2)), color: "#10dc60" },
      ].map((item, i) => (
        <div key={i} style={{ flex: "1 1 180px" }}>
          <CartTotales color={item.color} descripcion={item.label} numero={item.valor} />
        </div>
      ))}
    </div>


      <TablaPersonalizada
        columns={columns}
        data={comprasFiltradas}
        noDataComponent={<div style={{ padding: "1rem" }}>{mostrarInformacion ? "No existen resultados" : ""}</div>}
        showFilter={true}
        filterPlaceholder="Buscar por documento o responsable"
        filterFunction={(item, text) =>
          (item.usuario?.persona?.nombre ?? "").toLowerCase().includes(text.toLowerCase()) ||
          (item.serie ?? "").toLowerCase().includes(text.toLowerCase()) ||
          (item.numero ?? "").toLowerCase().includes(text.toLowerCase())
        }
      />

      <ReusableModal
        isOpen={!!compraSeleccionada}
        onClose={() => setCompraSeleccionada(null)}
        onConfirm={() => {}}
        confirmText=""
        cancelText="Cerrar"
        title="Detalle de compra"
      >
        <div className="ion-padding">
          {compraSeleccionada && (
            <IonGrid style={{ borderTop: "1px solid #ccc" }}>
              <IonRow style={{ fontWeight: "bold", borderBottom: "1px solid #ccc" }}>
                <IonCol>Producto</IonCol>
                <IonCol size="3" className="ion-text-center">Cantidad</IonCol>
                <IonCol size="3" className="ion-text-center">P. Compra</IonCol>
                <IonCol size="3" className="ion-text-center">Total</IonCol>
              </IonRow>
              {compraSeleccionada.detalles?.map((d : any, i) => (
                <IonRow key={i} className="ion-padding-vertical">
                  <IonCol>{d.presentacion?.descripcion ?? d.insumo?.nombre ?? "—"}</IonCol>
                  <IonCol size="3" className="ion-text-center">{d.cantidad}</IonCol>
                  <IonCol size="3" className="ion-text-center">S/ {d.precio_unitario.toFixed(2)}</IonCol>
                  <IonCol size="3" className="ion-text-center">S/ {d.total.toFixed(2)}</IonCol>
                </IonRow>
              ))}
            </IonGrid>
          )}
        </div>
      </ReusableModal>
    </div>
  );
};

export default Compra;