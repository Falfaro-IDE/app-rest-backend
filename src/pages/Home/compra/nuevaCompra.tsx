import {
  IonAlert, IonButton, IonCol, IonContent, IonGrid, IonIcon, IonInput, IonItem,
  IonLabel, IonRow, IonSelect, IonSelectOption, IonSpinner, useIonRouter, } from "@ionic/react";
import React, { createRef, useEffect, useState } from "react";
import { trash } from "ionicons/icons";
import useToast from "../../../hooks/alertMessage/useToast";
import { useConceptos } from "../../../hooks/useConceptos";
import { CompraRegistrarDto, DetalleCompraRegistrarDto, } from "../../../models/clases/Compra";
import { useProveedores } from "../../../hooks/useProveedor";
import { useInsumo } from "../../../hooks/useInsumo";
import { useProducto } from "../../../hooks/useProducto";
import {  Buscador, ResultadoItem, } from "../../../components/compartidos/BuscadorList";
import { ProductoSeleccionado } from "../../../components/compartidos/ProductoSeleccionado";
import "./nuevaCompra.css";
import { useCompra } from "../../../hooks/useCompra";
import values from "../../../models/clases/values";
import { TipoProducto } from "../../../models/clases/concepts";

const NuevaCompra: React.FC = () => {
  const [detalleCompra, setDetalleCompra] = useState<any[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState<ResultadoItem | null>(null);
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [listadoConceptosComprobantes, setConceptosComprobante] = useState<any[]>([]);
  const [listadoConceptosTipoCompra, setConceptoTipoCompra] = useState<any[]>([]);
  const [unidadesMedida, setUnidadesMedida] = useState<any[]>([]);
  const [tipoCompra, setTipoCompra] = useState<number | "">("");
  const [documento, setDocumento] = useState<number | "">("");
  const [proveedorId, setProveedorId] = useState<number | undefined>(undefined);
  const [serie, setSerie] = useState("");
  const [numero, setNumero] = useState("");
  const [descuento, setDescuento] = useState(0);
  const { showToast, ToastComponent } = useToast();
  const { obtenerConceptos, obtenerConceptosPagoCompra, LoadingComponent } = useConceptos();
  const { crearCompra } = useCompra();
  const { obtenerInsumos } = useInsumo();
  const { obtenerPresentacionesTexto } = useProducto();
  const [mostrarModalExito, setMostrarModalExito] = useState(false);
  const { obtenerProveedores } = useProveedores();
  const router = useIonRouter();
  const [errores, setErrores] = useState({
    tipoCompra: false,
    documento: false,
    serie: false,
    numero: false,
    fecha: false,
    hora: false,
    proveedorId: false,
  });
  const [fecha, setFecha] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [hora, setHora] = useState(() => {
    const now = new Date();
    return now.toTimeString().slice(0, 5); // "HH:mm"
  });
  const [cargando, setCargando] = useState(false);
  const totalCompra = detalleCompra.reduce((acc, item) => acc + item.total, 0);
  const totalConDescuento = Math.max(totalCompra - descuento, 0);
  const contentRef = createRef<HTMLIonContentElement>();

  const validarCampos = () => {
    const nuevosErrores = {
      tipoCompra: !tipoCompra,
      documento: !documento,
      serie: !serie.trim(),
      numero: !numero.trim(),
      fecha: !fecha.trim(),
      hora: !hora.trim(),
      proveedorId: !proveedorId,
    };
    setErrores(nuevosErrores);
    return !Object.values(nuevosErrores).some((e) => e);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [compResp, unidadesMedida, tipoResp, provResp] = await Promise.all([
          obtenerConceptos({ con_prefijo: 6 }),
          obtenerConceptos({ con_prefijo: 12 }),
          obtenerConceptosPagoCompra({ con_prefijo: 11 }),
          obtenerProveedores({}),
        ]);

        setConceptosComprobante(compResp?.data?.objeto || []);
        setUnidadesMedida(unidadesMedida?.data?.objeto || []);
        setConceptoTipoCompra(tipoResp?.data?.objeto || []);
        setProveedores(provResp?.data?.objeto || []);
      } catch {
        showToast("Error al cargar datos de compra", 3000, "danger");
      }
    };

    fetchData();
  }, []);

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
        unida: insumo.unidad_medida,
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
      console.error("Error:", error);
      return [];
    }
  };

  const agregarProducto = ( producto: ResultadoItem, unida: any,  cantidad: number, precio: number ) => {
    const nuevoItem = {
      tipo: producto.tipo,
      id: producto.id,
      producto: producto.nombre,
      unida: unida.con_descripcion,
      unidadCorrelativo: unida.con_correlativo,
      cantidad,
      precio,
      total: cantidad * precio,
    };

    console.log("Nuevo item a agregar:", nuevoItem);
    

    setDetalleCompra((prev) => [...prev, nuevoItem]);
    setProductoSeleccionado(null);
  };

  const eliminarProducto = (index: number) => {
    setDetalleCompra((prev) => prev.filter((_, i) => i !== index));
  };

  const guardarCompra = async () => {
    // Validación mínima
    if (
      !tipoCompra ||
      !documento ||
      !proveedorId ||
      detalleCompra.length === 0
    ) {
      showToast(
        "Ingrese productos o complete los datos de la compra",
        3000,
        "warning"
      );
      return;
    }

    const now = new Date();
    const fechaHoy = now.toISOString().split("T")[0];
    const horaActual = now.toTimeString().split(" ")[0];

    const detallesFormateados = detalleCompra.map((item) => {
      const detalle = new DetalleCompraRegistrarDto({
        cantidad: item.cantidad,
        precio_unitario: item.precio,
        total: item.total,
        fecha_creacion: fechaHoy,
        hora_creacion: horaActual,
        unidad: item.unidadCorrelativo ?? 0,
      });

      if (item.tipo === "presentacion") {
        detalle.producto_presentacion_id = item.id;
      } else if (item.tipo === "insumo") {
        detalle.insumo_id = item.id;
      }

      return detalle;
    });

    const compra = new CompraRegistrarDto({
      tipo: tipoCompra,
      documento,
      proveedor_id: proveedorId,
      serie,
      numero,
      fecha,
      hora,
      detalles: detallesFormateados,
      total: totalConDescuento,
      descuento,
      estado: 0,
      fecha_creacion: fechaHoy,
      hora_creacion: horaActual,
    });

    setCargando(true);

    try {
      console.log(compra);
      
      const respuesta = await crearCompra(compra);
      if (respuesta.success) {
        sessionStorage.setItem("mensajeCompra", "Compra registrada con éxito");
        setMostrarModalExito(true); // mostrar modal
      } else {
        showToast(
          "Ocurrió un error al registrar la compra. Intente nuevamente.",
          3000,
          "danger"
        );
        console.error(
          "Error al registrar la compra:",
          respuesta.data.descripcion
        );
      }
    } catch (error) {
      console.error("Error al registrar la compra:", error);
      showToast("Error de conexión al guardar la compra", 3000, "danger");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div>
      <div>
          <h1 style={{textAlign: 'center', fontWeight: 'bold'}}>REGISTRAR COMPRA</h1>
      </div>
      {LoadingComponent}
      {ToastComponent}
      <div className="div-registrar-compra">
      <div
        style={{
          flex: 1,
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
        className="datos-compra"
      >
        <IonItem
          lines="inset"
          className={errores.tipoCompra ? "input-error" : ""}
        >
          <IonLabel position="stacked">Tipo de Compra</IonLabel>
          <IonSelect
            value={tipoCompra}
            onIonChange={(e) => setTipoCompra(Number(e.detail.value))}
          >
            <IonSelectOption value="" disabled>
              Seleccionar tipo de pago
            </IonSelectOption>
            {listadoConceptosTipoCompra
              .filter((item) => item.con_correlativo !== 0)
              .map((item) => (
                <IonSelectOption
                  key={item.con_correlativo}
                  value={item.con_correlativo}
                >
                  {item.con_descripcion}
                </IonSelectOption>
              ))}
          </IonSelect>
        </IonItem>

        <IonItem
          lines="inset"
          className={errores.documento ? "input-error" : ""}
        >
          <IonLabel position="stacked">Documento</IonLabel>
          <IonSelect
            value={documento}
            onIonChange={(e) => setDocumento(Number(e.detail.value))}
          >
            <IonSelectOption value="" disabled>
              Seleccionar comprobante
            </IonSelectOption>
            {listadoConceptosComprobantes
              .filter(
                (item) =>
                  item.con_correlativo !== 0 && item.con_correlativo !== 3
              )
              .map((item) => (
                <IonSelectOption
                  key={item.con_correlativo}
                  value={item.con_correlativo}
                >
                  {item.con_descripcion}
                </IonSelectOption>
              ))}
          </IonSelect>
        </IonItem>

        {/* Serie y Número */}
        <div style={{ display: "flex", gap: "8px" }}>
          <IonItem
            className={errores.serie ? "input-error" : ""}
            style={{ flex: 1 }}
            lines="inset"
          >
            <IonLabel position="stacked">Serie</IonLabel>
            <IonInput
              value={serie}
              onIonChange={(e) => setSerie(e.detail.value!)}
            />
          </IonItem>

          <IonItem
            className={errores.numero ? "input-error" : ""}
            style={{ flex: 1 }}
            lines="inset"
          >
            <IonLabel position="stacked">Número</IonLabel>
            <IonInput
              value={numero}
              onIonChange={(e) => setNumero(e.detail.value!)}
            />
          </IonItem>
        </div>

        {/* Fecha y hora */}
        <div style={{ display: "flex", gap: "8px" }}>
          <IonItem
            className={errores.fecha ? "input-error" : ""}
            style={{ flex: 1 }}
            lines="inset"
          >
            <IonLabel position="stacked">Fecha</IonLabel>
            <IonInput
              type="date"
              value={fecha}
              onIonChange={(e) => setFecha(e.detail.value!)}
            />
          </IonItem>

          <IonItem
            className={errores.hora ? "input-error" : ""}
            style={{ flex: 1 }}
            lines="inset"
          >
            <IonLabel position="stacked">Hora</IonLabel>
            <IonInput
              type="time"
              value={hora}
              onIonChange={(e) => setHora(e.detail.value!)}
            />
          </IonItem>
        </div>

        <IonItem
          className={errores.proveedorId ? "input-error" : ""}
          lines="inset"
        >
          <IonLabel position="stacked">Proveedor</IonLabel>
          <IonSelect
            value={proveedorId}
            onIonChange={(e) => setProveedorId(e.detail.value)}
          >
            <IonSelectOption value="" disabled>
              Seleccionar proveedor
            </IonSelectOption>
            {proveedores.map((item) => (
              <IonSelectOption key={item.id} value={item.id}>
                {item.nombre}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
      </div>

      {/* Columna derecha */}
      <div style={{ flex: 2 }}>
        <Buscador
          buscar={buscarTodo}
          placeholder="Buscar nombre producto o insumo"
          onSeleccionar={(item) => {
            console.log("Item seleccionado:", item);
            setProductoSeleccionado(item);
          }}
        />

        <ProductoSeleccionado
          producto={productoSeleccionado}
          unidadesMedida={unidadesMedida}
          onAgregar={agregarProducto}
          onCancelar={() => setProductoSeleccionado(null)}
        />

        <div
          style={{
            marginTop: "5px",
            backgroundColor: "#fff",
            padding: "10px",
            borderRadius: "12px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          }}
        >
          <IonGrid>
            <IonRow
              style={{
                backgroundColor: "#f2f2f2",
                borderRadius: "8px",
                fontWeight: "bold",
                padding: "2px 0",
                textAlign: "center",
              }}
            >
              <IonCol>Producto</IonCol>
              <IonCol size="2">Unidad</IonCol>
              <IonCol size="2">Cantidad</IonCol>
              <IonCol size="2">Precio</IonCol>
              <IonCol size="2">Total</IonCol>
              <IonCol size="1">Acción</IonCol> {/* Nueva columna */}
            </IonRow>
            <div
              style={{
                marginTop: "5px",
                maxHeight: "250px",
                overflowY: "auto",
              }}
            >
              {detalleCompra.map((item, i) => (
                <IonRow
                  key={i}
                  style={{
                    borderBottom: "1px solid #e0e0e0",
                    alignItems: "center",
                    padding: "8px 0",
                  }}
                >
                  <IonCol>{item.producto}</IonCol>
                  <IonCol size="2" style={{ textAlign: "center" }}>
                    {item.unida}
                  </IonCol>
                  <IonCol size="2" style={{ textAlign: "center" }}>
                    {item.cantidad}
                  </IonCol>
                  <IonCol size="2" style={{ textAlign: "center" }}>
                    S/ {item.precio.toFixed(2)}
                  </IonCol>
                  <IonCol size="2" style={{ textAlign: "center" }}>
                    S/ {item.total.toFixed(2)}
                  </IonCol>
                  <IonCol size="1" style={{ textAlign: "center" }}>
                    <IonButton
                      color="danger"
                      size="small"
                      onClick={() => eliminarProducto(i)}
                    >
                      <IonIcon icon={trash} />
                    </IonButton>
                  </IonCol>
                </IonRow>
              ))}
            </div>
          </IonGrid>
          {/* Total y botón fuera del scroll */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "20px",
              paddingTop: "10px",
              borderTop: "1px solid #ccc",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <IonLabel>Descuento:</IonLabel>
              <IonInput
                type="number"
                value={descuento}
                min={0}
                onIonChange={(e) => setDescuento(Number(e.detail.value))}
                style={{ width: "100px" }}
              />
            </div>

            <div
              style={{
                fontSize: "1.4rem",
                fontWeight: "bold",
                color: "#2c3e50",
                textAlign: "right",
              }}
            >
              Total a pagar: S/ {totalConDescuento.toFixed(2)}
            </div>
          </div>
        </div>

        <IonButton
          expand="block"
          color="success"
          style={{ marginTop: "15px" }}
          onClick={() => {
            if (validarCampos()) {
              guardarCompra();
            }
          }}
        >
          {cargando ? <IonSpinner name="crescent" /> : "Registrar Compra"}
        </IonButton>
      </div>

      <IonAlert
        isOpen={mostrarModalExito}
        onDidDismiss={() => {
          setMostrarModalExito(false);
          router.push(
            values.rutas.rutas.homePrincipal.rutaPrincipal +
              values.rutas.rutas.homePrincipal.compra.listadocompra,
            "forward"
          );
        }}
        header="Éxito"
        message="La compra se registró correctamente."
        buttons={["OK"]}
      />
      </div>
    </div>
  );
};

export default NuevaCompra;
