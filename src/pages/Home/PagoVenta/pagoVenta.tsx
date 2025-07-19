import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCol,
  IonGrid,
  IonInput,
  IonItem,
  IonLabel,
  IonRow,
  IonSpinner,
  IonList,
  IonIcon,
  IonToggle,
  IonSearchbar,
  useIonRouter,
  IonAlert,
} from "@ionic/react";
import { cash, personAdd } from "ionicons/icons";
import { useConceptos } from "../../../hooks/useConceptos";
import useToast from "../../../hooks/alertMessage/useToast";
import { usePagoVentas } from "../../../hooks/usePagoVenta";
import values from "../../../models/clases/values";
import { StorageService } from "../../../utils/storageService";
import PdfViewer from "../../../components/compartidos/PDFViewer";
import { BuscadorCliente } from "../../../components/compartidos/BuscadorCliente";
import NuevoClienteModal from "../Cliente/NuevoClienteModal";
import { ClienteClass } from "../../../models/clases/Cliente";
import { useMetodosPagos } from "../../../hooks/useMetodosPagos";
import "./pagoVenta.css";
import { TipoDocumento } from "../../../models/clases/concepts";

const clientesSimulados = [
  { id: 1, nombre: "Juan Pérez" },
  { id: 2, nombre: "María López" },
  { id: 3, nombre: "Carlos Sánchez" },
  { id: 4, nombre: "Ana Torres" },
  { id: 5, nombre: "Luis Ramírez" },
];

const PagoVenta: React.FC = () => {
  const [comprobante, setComprobante] = useState<any>(null);
  const [pagos, setPagos] = useState<
    { metodo: number; descripcion: string; monto: number }[]
  >([]);
  const [descuento, setDescuento] = useState<number>(0);
  const [activarDescuento, setActivarDescuento] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [pedidoLista, setPedidoLista] = useState<any>(null);
  const [cliente, setCliente] = useState<any>({ id: 0, persona:{ nombre: "Público en general"}, ruc_factura: "" });
  const [filtroClientes, setFiltroClientes] = useState<
    typeof clientesSimulados
  >([]);
  const [ConceptosComprobantes, setConceptosComprobante] = useState<any[]>([]);
  const [ConceptosMetodosPagos, setConceptosMetodosPago] = useState<any[]>([]);
  const [mostrarModalExito, setMostrarModalExito] = useState(false);
  const usuarioEmpresa = StorageService.getItem(values.storage.keySession);
  const { obtenerConceptos } = useConceptos();
  const { obtenerMetodosPagos } = useMetodosPagos();
  const { RegistrarVenta } = usePagoVentas();
  const { showToast, ToastComponent } = useToast();
  const location = useLocation();
  const router = useIonRouter();
  const [mostrarPdf, setMostrarPdf] = useState(false);
  const [pdfBase64, setPdfBase64] = useState("");
  const [pdfsBase64, setPdfsBase64] = useState<string[]>([]);
  const [showClienteModal, setShowClienteModal] = useState<boolean>(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(
    new ClienteClass()
  );

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const pedidoStr = query.get("pedido");
    if (pedidoStr) {
      const parsed = JSON.parse(decodeURIComponent(pedidoStr));
      console.log(parsed);

      setPedidoLista(parsed);
    }
  }, [location.search]);

  useEffect(() => {
    const cargarConceptos = async () => {
      try {
        const [comprobantesResp] = await Promise.all([
          obtenerConceptos({ con_prefijo: 6 }),
        ]);
        setConceptosComprobante(
          (comprobantesResp?.data?.objeto || []).filter(
            (c: any) => c.con_correlativo !== 0
          )
        );
      } catch {
        showToast(
          "Error al cargar comprobantes y métodos de pago",
          3000,
          "danger"
        );
      }
    };

    const cargarMetodosPagos = async () => {
      try {
        const mediosPagosResp = await obtenerMetodosPagos();
        console.log(mediosPagosResp);

        setConceptosMetodosPago(
          (mediosPagosResp?.data?.objeto || []).filter(
            (m: any) => m.estado != 0
          )
        );
      } catch {
        showToast(
          "Error al cargar comprobantes y métodos de pago",
          3000,
          "danger"
        );
      }
    };

    cargarConceptos();
    cargarMetodosPagos();
  }, []);

  // Cálculos
  const montoTotalPedido = pedidoLista?.monto_total || 0;
  const montoFinal = Math.max(
    montoTotalPedido - (activarDescuento ? descuento : 0),
    0
  );
  const igv = calcularIGV(montoFinal, comprobante);
  const montoPagado = pagos.reduce((sum, p) => sum + p.monto, 0);
  const vuelto = Math.max(montoPagado - montoFinal, 0);

  function calcularIGV(total: number, comp: any) {
    if (!comp) return 0;
    const desc = (comp.con_descripcion || "").toLowerCase();
    if (desc.includes("boleta") || desc.includes("factura")) {
      return +(total * 0.18).toFixed(2);
    }
    return 0;
  }

  function toggleMetodo(metodo: any) {
    setPagos((prev) => {
      const existe = prev.find((p) => p.metodo === metodo.metodo_pago_id);
      return existe
        ? prev.filter((p) => p.metodo !== metodo.metodo_pago_id)
        : [
            ...prev,
            {
              metodo: metodo.metodo_pago_id,
              descripcion: metodo.nombre,
              monto: 0,
            },
          ];
    });
  }

  function actualizarMonto(metodo: number, monto: number) {
    setPagos((prev) =>
      prev.map((p) => (p.metodo === metodo ? { ...p, monto } : p))
    );
  }

  function filtrarClientes(valor: string) {
    const limpio = valor.trim();
    setCliente({ id: 0, nombre: valor });
    if (!limpio) {
      setFiltroClientes([]);
    } else {
      setFiltroClientes(
        clientesSimulados.filter((c) =>
          c.nombre.toLowerCase().includes(limpio.toLowerCase())
        )
      );
    }
  }

  async function confirmarPago() {
    if (montoPagado < montoFinal) {
      alert(
        `Monto insuficiente. Falta S/ ${(montoFinal - montoPagado).toFixed(2)}`
      );
      return;
    }
    setLoading(true);
    const now = new Date();
    const usuarioEmpresa = StorageService.getItem(values.storage.keySession);
    const datosEmpresa = usuarioEmpresa?.objeto || {};
    const ventaData = {
      serie: 0,
      correlativo: 0,
      comprobante_id: comprobante?.con_correlativo,
      metodo_pago: pagos.map((p) => ({ metodo: p.metodo, monto: p.monto })),
      cliente_id: cliente.id,
      nombre_cliente: cliente.nombre,
      dni_ruc: cliente.ruc_dni,
      descuento: activarDescuento ? descuento : 0,
      sub_total: +(montoFinal - igv).toFixed(2),
      igv,
      total_pagar: montoFinal,
      monto_cancelado: montoPagado,
      pedido_id: pedidoLista?.id,
      vuelto,
      fecha_venta: now.toISOString().split("T")[0],
      hora_venta: now.toTimeString().split(" ")[0],
      fecha_creacion: now.toISOString().split("T")[0],
      hora_creacion: now.toTimeString().split(" ")[0],
      mesa_id: pedidoLista.mesa_id,
      nombre_mesa: pedidoLista.nombre_mesa,
      mozo: pedidoLista.usuario_id,
      cajero: datosEmpresa.nombre,
      empresa: {
        razonSocial: datosEmpresa.razonSocial,
        direccion: datosEmpresa.direccion,
        ruc_dni: datosEmpresa.ruc_dni,
        email: datosEmpresa.email,
      },
      cliente: cliente,
      detallePedido: pedidoLista.detallePedido,
    };
    // console.log(ventaData);
    // return;
    const respuesta = await RegistrarVenta(ventaData);
    setLoading(false);
    if (!respuesta.success) {
      showToast(respuesta.descripcion || "Ocurrió un error", 3000, "danger");
    } else {
      showToast("Venta generada correctamente", 3000, "success");
      if (respuesta.data.objeto) {
        const base64PDF = respuesta.data.objeto;
        setMostrarPdf(true);
        setPdfBase64(base64PDF);
        setMostrarModalExito(true);
      }
    }
  }

  const registrarCliente = () => {
    setShowClienteModal(true);
  };

  return (
    <div className="pagoventa-container">
      <IonGrid>
        <IonRow>
          <IonCol>
            <IonCard>
              <IonCardContent>
                <IonLabel>Comprobante</IonLabel>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                    marginBottom: 8,
                  }}
                >
                  {ConceptosComprobantes.map((tipo) => (
                    <IonButton
                      key={tipo.con_correlativo}
                      fill={
                        comprobante?.con_correlativo === tipo.con_correlativo
                          ? "solid"
                          : "outline"
                      }
                      color="primary"
                      size="small"
                      onClick={() => setComprobante(tipo)}
                    >
                      {tipo.con_descripcion.toUpperCase()}
                    </IonButton>
                  ))}
                </div>

                <IonLabel>Cliente</IonLabel>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <BuscadorCliente
                    placeholder={cliente.persona.nombre}
                    onSeleccionar={(item) => {
                      console.log("seleccionado", item);
                      const documentos = item?.persona?.documentos || [];
                      const documentoRUC = documentos.find((doc: any) => doc.tipoDocumento?.para_correlativo === TipoDocumento.RUC.para_correlativo && doc.numero?.trim());
                      console.log("Documento RUC:", documentoRUC);
                      setCliente({...item, ruc_factura: documentoRUC?.numero || ""});
                    }}
                  />
                  {/* <IonSearchbar
                    mode="ios"
                    placeholder="Público en General"
                    value={cliente.nombre}
                    onIonInput={(e) => filtrarClientes(e.detail.value!)}
                    style={{ flex: 1, padding: 0 }}
                  /> */}
                  <IonButton
                    size="small"
                    fill="solid"
                    color="primary"
                    onClick={() => {
                      registrarCliente();
                    }}
                  >
                    <IonIcon icon={personAdd} />
                  </IonButton>
                  <NuevoClienteModal
                    isOpen={showClienteModal}
                    onClose={() => setShowClienteModal(false)}
                    onConfirm={(clienteActualizado) => {
                      if (clienteActualizado.id != 0) {
                        setShowClienteModal(false);
                        const documentos = clienteActualizado?.persona?.documentos || [];
                        const documentoRUC = documentos.find((doc: any) => doc.tipoDocumento?.para_correlativo === TipoDocumento.RUC.para_correlativo && doc.numero?.trim());
                        setCliente({...clienteActualizado, ruc_factura: documentoRUC?.numero || ""});
                      }
                      //registrarCliente(clienteActualizado);
                      //zsetShowClienteModal(false);
                    }}
                    cliente={clienteSeleccionado}
                    modo={1}
                  />
                </div>

                {filtroClientes.length > 0 && (
                  <IonList
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: 4,
                      marginTop: 4,
                      maxHeight: 150,
                      overflowY: "auto",
                    }}
                  >
                    {filtroClientes.map((c) => (
                      <IonItem
                        key={c.id}
                        button
                        onClick={() => {
                          setCliente(c);
                          setFiltroClientes([]);
                        }}
                      >
                        {c.nombre}
                      </IonItem>
                    ))}
                  </IonList>
                )}

                {
                  comprobante && comprobante.con_correlativo == 1 && (
                    <>
                      <IonItem>
                          <IonInput
                            label="RUC"
                            type="text"
                            maxlength={11}
                            value={cliente.ruc_factura || ""}
                            placeholder="Ingrese RUC"
                            onIonInput={(e) => {
                              const valor = e.detail.value || "";
                              setCliente((prev:any) => ({
                                ...prev,
                                ruc_factura: valor,
                              }));
                            }}
                          />
                      </IonItem>
                    </>
                  )
                }

                <IonLabel style={{ marginTop: 8 }}>Método(s) de Pago</IonLabel>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                    marginBottom: 8,
                  }}
                >
                  {ConceptosMetodosPagos.map((m) => (
                    <IonButton
                      key={m.metodo_pago_id}
                      fill={
                        pagos.some((p) => p.metodo === m.metodo_pago_id)
                          ? "solid"
                          : "outline"
                      }
                      color="success"
                      size="small"
                      onClick={() => toggleMetodo(m)}
                    >
                      {m.nombre.toUpperCase()}
                    </IonButton>
                  ))}
                </div>

                {pagos.map((p, idx) => (
                  <IonItem key={idx}>
                    <IonLabel>{p.descripcion}</IonLabel>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginLeft: "auto",
                      }}
                    >
                      <span style={{ marginRight: 4 }}>S/</span>
                      <IonInput
                        type="number"
                        value={p.monto}
                        min={0}
                        style={{ maxWidth: 100, textAlign: "right" }}
                        onIonInput={(e) => {
                          const numero = Number(e.detail.value) || 0;
                          actualizarMonto(p.metodo, numero);
                        }}
                      />
                    </div>
                  </IonItem>
                ))}

                <IonItem lines="none" style={{ marginTop: 12 }}>
                  <IonLabel>Activar descuento</IonLabel>
                  <IonToggle
                    checked={activarDescuento}
                    onIonChange={(e) => {
                      setActivarDescuento(e.detail.checked);
                      if (!e.detail.checked) setDescuento(0);
                    }}
                    style={{ marginLeft: "auto" }}
                  />
                </IonItem>

                {activarDescuento && (
                  <IonItem>
                    <IonLabel>Descuento</IonLabel>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginLeft: "auto",
                      }}
                    >
                      <span>S/</span>
                      <IonInput
                        type="number"
                        value={descuento}
                        min={0}
                        style={{ maxWidth: 100, textAlign: "right" }}
                        onIonInput={(e) => {
                          const numero = Number(e.detail.value) || 0;
                          setDescuento(numero);
                        }}
                      />
                    </div>
                  </IonItem>
                )}
              </IonCardContent>
            </IonCard>
          </IonCol>

          <IonCol>
            <IonCard>
              <IonCardContent>
                <IonList>
                  {pedidoLista?.detallePedido?.map(
                    (detalle: any, idx: number) => (
                      <IonItem key={idx}>
                        <IonGrid>
                          <IonRow>
                            <IonCol size="8">
                              <div style={{ fontWeight: "bold" }}>
                                {detalle.descripcion}
                              </div>
                              <div
                                style={{ fontSize: "smaller", color: "gray" }}
                              >
                                {detalle.codigoPresentacion}
                              </div>
                            </IonCol>
                            <IonCol size="4" className="ion-text-end">
                              <div style={{ fontWeight: "bold" }}>
                                S/{" "}
                                {(detalle.cantidad * detalle.precio).toFixed(2)}
                              </div>
                            </IonCol>
                          </IonRow>
                        </IonGrid>
                      </IonItem>
                    )
                  )}
                </IonList>
                <IonGrid>
                  <IonRow>
                    {/* IZQUIERDA */}
                    <IonCol size="6">
                      <IonItem lines="none">
                        <IonLabel>Monto Cancelado</IonLabel>
                        <p style={{ fontWeight: "bold", marginLeft: "auto" }}>
                          S/ {montoPagado.toFixed(2)}
                        </p>
                      </IonItem>

                      {vuelto > 0 && (
                        <IonItem lines="none">
                          <IonLabel>Vuelto</IonLabel>
                          <p
                            style={{
                              fontWeight: "bold",
                              color: "green",
                              marginLeft: "auto",
                            }}
                          >
                            S/ {vuelto.toFixed(2)}
                          </p>
                        </IonItem>
                      )}
                    </IonCol>

                    {/* DERECHA */}
                    <IonCol size="6">
                      <IonItem lines="none">
                        <IonLabel>SubTotal</IonLabel>
                        <p style={{ fontWeight: "bold", marginLeft: "auto" }}>
                          S/ {(montoFinal - igv).toFixed(2)}
                        </p>
                      </IonItem>

                      <IonItem lines="none">
                        <IonLabel>IGV</IonLabel>
                        <p style={{ fontWeight: "bold", marginLeft: "auto" }}>
                          S/ {igv.toFixed(2)}
                        </p>
                      </IonItem>

                      <IonItem lines="none">
                        <IonLabel>Total</IonLabel>
                        <p
                          style={{
                            fontWeight: "bold",
                            fontSize: "1.2em",
                            marginLeft: "auto",
                          }}
                        >
                          S/ {montoFinal.toFixed(2)}
                        </p>
                      </IonItem>
                    </IonCol>
                  </IonRow>
                </IonGrid>
                <div className="ion-text-end" style={{ marginTop: 16 }}>
                  <IonButton
                    color="success"
                    onClick={confirmarPago}
                    disabled={loading || pagos.length === 0 || !comprobante}
                  >
                    {loading ? (
                      <IonSpinner name="dots" />
                    ) : (
                      <>
                        <IonIcon icon={cash} slot="start" />
                        Confirmar Pago
                      </>
                    )}
                  </IonButton>
                </div>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
      </IonGrid>
      {mostrarPdf && <PdfViewer base64PDF={pdfBase64} />}
      {pdfsBase64.map((pdf, index) => (
        <PdfViewer key={index} base64PDF={pdf} />
      ))}
      <IonAlert
        isOpen={mostrarModalExito}
        onDidDismiss={() => {
          setMostrarModalExito(false);
          router.push(
            values.rutas.rutas.homePrincipal.rutaPrincipal +
              values.rutas.rutas.homePrincipal.venta,
            "forward"
          );
        }}
        header="Éxito"
        message="La venta se registró correctamente."
        buttons={["OK"]}
      />
      {ToastComponent}
    </div>
  );
};

export default PagoVenta;
