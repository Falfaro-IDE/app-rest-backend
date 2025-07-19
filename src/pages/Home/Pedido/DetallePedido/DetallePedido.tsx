import React, { useEffect, useState } from "react";
import {
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonFooter,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonInput,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCheckbox,
  useIonRouter,
  IonAlert,
} from "@ionic/react";
import {
  trash,
  chatbubbleEllipses,
  desktop,
  calendarOutline,
  timeOutline,
  print,
  add,
  remove,
  cash,
  listSharp,
} from "ionicons/icons";
import "./DetallePedido.css";
import {
  chatboxOutline,
  fastFoodOutline,
  trashOutline,
  closeOutline,
} from "ionicons/icons";
import CustomButton from "../../../../components/compartidos/CustomButton";
import {
  DetallePedidoClass,
  PedidoClass,
} from "../../../../models/clases/Pedido";
import { useVenta } from "../../../../hooks/useVenta";
import { ProductoClass } from "../../../../models/clases/Producto";
import ReusableModal from "../../../../components/compartidos/ReusableModal";
import CustomInput from "../../../../components/compartidos/CustomInput";
import { useParams } from "react-router-dom";
import values from "../../../../models/clases/values";
import useToast from "../../../../hooks/alertMessage/useToast";
import CustomAlert from "../../../../components/compartidos/CustomAlert";
import PdfViewer from "../../../../components/compartidos/PDFViewer";
import { calcularTotales } from "../../../../utils/calcularTotales";
import { useAutorizacion } from "../../../../hooks/useAutorizacion";
import AuthorizationModal from "../../../../components/compartidos/AutorizacionModal";
import {
  RestablecerStock,
  TipoOperacion,
} from "../../../../models/clases/concepts";
interface DetallePedidoProps {
  detalle: any;
}

type PedidoParams = {
  id: string;
  idMesa: string;
};

const DetallePedido: React.FC<DetallePedidoProps> = ({ detalle }) => {
  const [pedidos, setPedidos] = useState([
    {
      idUnico: 1,
      nombre: "INKA COLA",
      cantidad: 1,
      precio: 4.0,
      stock: 9,
      detalle: "1/2 L",
      color: "warning",
    },
  ]);
  const [detallePedidoAgregar, setDetallePedidoAgregar] = useState<PedidoClass>(
    new PedidoClass()
  );
  const [pedidoAgregar, setPedidoAgregar] = useState<DetallePedidoClass[]>([]);
  const [isModalNotas, setIsModalNotas] = useState(false);
  const [productoNotas, setProductoNotas] = useState<DetallePedidoClass>(
    new DetallePedidoClass()
  );
  const [nuevaNota, setNuevaNota] = useState("");
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [notasSeleccionados, setNotasSeleccionados] = useState<any[]>([]);
  const [registrarNota, setRegistrarNota] = useState<DetallePedidoClass>(
    new DetallePedidoClass()
  );
  const [pedidoLista, setPedidoLista] = useState<PedidoClass>(
    new PedidoClass()
  );
  const { id, idMesa } = useParams<PedidoParams>();
  const [pedidoId, setPedidoId] = useState({ id: Number(id) });
  const [mesaId, setMesaId] = useState({ idMesa: Number(idMesa) });
  const [mostarInformacion, setMostrarInformacion] = useState(false);
  const [isModalDetalle, setIsModalDetalle] = useState(false);
  const [pedidoDetalle, setPedidoDetalle] = useState<DetallePedidoClass[]>([]);
  const [pedidoDetalleSeleccionado, setPedidoDetalleSeleccionado] =
    useState<DetallePedidoClass>(new DetallePedidoClass());
  const router = useIonRouter();
  const [showAlert, setShowAlert] = useState(false);
  const [mostrarAlertaStock, setMostrarAlertaStock] = useState(false);
  const [showAlertPedidoCompleto, setShowAlertPedidoCompleto] = useState(false);
  const [eliminarNotaTrama, setEliminarNotaTrama] = useState<any>();
  const [modalAbierto, setModalAbierto] = useState(false);

  const {
    registrarPedido,
    generarPreCuentaPDF,
    obtenerPedidos,
    actualizarPedido,
    obtenerDetallePedido,
    eliminarDetallePedido,
    eliminarPedidoCompleto,
    eliminarNota,
    LoadingComponent,
    ToastComponent,
    obtenerNotas,
    registrarNotas,
  } = useVenta();
  const { ToastComponent: ToastUseToastComponent, showToast } = useToast();
  const [mostrarPdf, setMostrarPdf] = useState(false);
  const [pdfBase64, setPdfBase64] = useState("");
  const [restablecerStockPedido, setrestablecerStock] = useState<number>(0);
  const [pdfsBase64, setPdfsBase64] = useState<string[]>([]);
  const [esCortesiaSeleccionada, setEsCortesiaSeleccionada] = useState(false);
  const [showPedidoEliminadoModal, setShowPedidoEliminadoModal] =
    useState(false);
  const [showPedidoCreadoModal, setShowPedidoCreadoModal] = useState(false);
  const [clienteNombre, setClienteNombre] = useState("Público en General");
  const aumentarCantidad = (idUnico: number) => {
    setPedidos(
      pedidos.map((p) =>
        p.idUnico === idUnico ? { ...p, cantidad: p.cantidad + 1 } : p
      )
    );
  };
  const {
    solicitarAutorizacion,
    enviarPin,
    showModal,
    setShowModal,
    ToastComponent: ToastAutorizacion,
    LoadingComponent: LoadingAutorizacion,
  } = useAutorizacion();

  const disminuirCantidad = (idUnico: number) => {
    setPedidos(
      pedidos.map((p) =>
        p.idUnico === idUnico && p.cantidad > 1
          ? { ...p, cantidad: p.cantidad - 1 }
          : p
      )
    );
  };

  const eliminarPedido = (detalle: any) => {
    setPedidoAgregar(
      pedidoAgregar.filter((p) => p.idUnico !== detalle.idUnico)
    );
    setDetallePedidoAgregar({
      ...detallePedidoAgregar,
      detallePedido: pedidoAgregar.filter((p) => p.idUnico !== detalle.idUnico),
    });
  };

  const total = pedidoAgregar.reduce(
    (acc, p) => acc + p.precio * p.cantidad,
    0
  );

  useEffect(() => {
    validarEntradas(detalle);
  }, [detalle]);

  useEffect(() => {
    listarPedido(id);
  }, []);

  const listarPedido = async (id: any) => {
    if (Number(id) == 0 || id == undefined) {
    } else {
      const pedido = {
        id: Number(id),
      };
      setPedidoId(pedido);
      const response = await obtenerPedidos(pedido);
      console.log("PEDIDO RESIVIDO: ", response);

      if (response.success) {
        setPedidoLista(response.data.objeto[0]);
        const nuevaData = {
          ...detallePedidoAgregar,
          pedido_id: response.data.objeto[0].id,
        };
        setDetallePedidoAgregar(nuevaData);
      }
    }
    setMostrarInformacion(true);
  };

  const validarEntradas = (detalle: any) => {
    if (detalle[0] == 0) {
      showToast("No hay stock disponible", 3000, "warning");
      return;
    }
    setPedidoAgregar((prevPedido) => {
      const nuevoPedido = [...prevPedido];
      detalle.forEach((element: any, index: number) => {
        console.log("ID PRESENTACION ", element);

        const indexExistenteFind = nuevoPedido.find(
          (item) =>
            item.producto_presentacion_id ===
              element.producto_presentacion_id && item.contieneNotas === false
        );
        if (indexExistenteFind !== undefined) {
          const indexExistente = nuevoPedido.findIndex(
            (item) => item.idUnico === indexExistenteFind.idUnico
          );
          nuevoPedido[indexExistente] = {
            ...nuevoPedido[indexExistente],
            cantidad: nuevoPedido[indexExistente].cantidad + 1,
            stock: nuevoPedido[indexExistente].stock - 1,
          };
        } else {
          nuevoPedido.push({
            ...element,
            cantidad: 1,
            stock_inicio: element.stock,
            stock: element.stock - 1,
            idUnico: crypto.randomUUID(),
            comentario: "",
            contieneNotas: false,
          });
        }
      });
      return nuevoPedido;
    });
  };

  const actualizarStock = (detalles: any) => {
    const nuevoPedido = pedidoAgregar.map((item: any) => {
      if (item.idUnico === detalles.idUnico) {
        const nuevoStockCalculado = item.cantidad + 1;
        if (
          item.control_stock == 0 &&
          item.cortesia == 1 &&
          nuevoStockCalculado > item.stock_inicio
        ) {
          showToast("Stock límite", 3000, "warning");
          return item;
        }

        const nuevoStockDisponible = item.stock_inicio - nuevoStockCalculado;

        return {
          ...item,
          cantidad: nuevoStockCalculado,
          stock: nuevoStockDisponible,
        };
      }
      return item;
    });

    setPedidoAgregar(nuevoPedido);
    setDetallePedidoAgregar({
      ...detallePedidoAgregar,
      detallePedido: nuevoPedido,
    });
  };

  const disminuirStock = (producto: any) => {
    const nuevoPedido = pedidoAgregar.map((item: any) => {
      if (item.idUnico === producto.idUnico) {
        const cantidad = item.cantidad > 1 ? item.cantidad - 1 : 1;
        const nuevoStockDisponible = item.stock_inicio - cantidad;
        return {
          ...item,
          cantidad: cantidad,
          stock: nuevoStockDisponible,
        };
      }
      return item;
    });

    setPedidoAgregar(nuevoPedido);
    setDetallePedidoAgregar({
      ...detallePedidoAgregar,
      detallePedido: nuevoPedido,
    });
  };

  const actualizarStockManual = (idProducto: any, valor: number) => {
    const nuevoPedido = pedidoAgregar.map((item: any) => {
      if (item.idUnico === idProducto) {
        let cantidad = valor > 0 ? valor : 1;

        if (
          item.control_stock == 0 &&
          item.cortesia == 1 &&
          cantidad > item.stock_inicio
        ) {
          cantidad = item.stock_inicio;
        }

        const nuevoStockDisponible = item.stock_inicio - cantidad;
        return {
          ...item,
          cantidad,
          stock: nuevoStockDisponible,
        };
      }
      return item;
    });

    setPedidoAgregar(nuevoPedido);
    setDetallePedidoAgregar({
      ...detallePedidoAgregar,
      detallePedido: nuevoPedido,
    });
  };

  const confirmarPedido = async () => {
    const horaActual = new Date().toTimeString().split(" ")[0];
    const totales = calcularTotales(pedidoAgregar);
    const montoAnterior = pedidoLista?.monto_total || 0;
    const subtotalAnterior = pedidoLista?.subtotal || 0;
    const igvAnterior = pedidoLista?.igv || 0;
    const descuentoAnterior = pedidoLista?.descuento || 0;
    const ofertaAnterior = pedidoLista?.oferta || 0;
    const nuevaData = {
      ...detallePedidoAgregar,
      ...(pedidoId?.id && { id: pedidoId.id }),
      fecha_creacion: new Date().toISOString().split("T")[0],
      hora_creacion: horaActual,
      hora_pedido: horaActual,
      fecha_pedido: new Date().toISOString().split("T")[0],
      mesa_id: mesaId.idMesa,
      nombre_cliente: clienteNombre,
      detallePedido: pedidoAgregar.map((detalle: any) => ({
        ...detalle,
        cortesia: detalle.cortesia,
        hora_detalle: horaActual,
      })),
      monto_total: montoAnterior + totales.totalFinal,
      subtotal: subtotalAnterior + totales.subtotal,
      igv: igvAnterior + totales.igv,
      descuento: descuentoAnterior + totales.descuentoTotal,
      oferta: ofertaAnterior + totales.ofertaTotal,
    };

    console.log("NUEVA DATA", nuevaData);
    // return ;
    setDetallePedidoAgregar(nuevaData);
    if (pedidoId.id == 0) {
      const response: any = await registrarPedido(nuevaData);
      if (response.success) {
        setPedidoAgregar([]);
        setDetallePedidoAgregar(new PedidoClass());
        setPedidoLista(new PedidoClass());
        listarPedido(pedidoId.id);
        await generarComanda(response);
        setShowPedidoCreadoModal(true);
        // router.push(values.rutas.rutas.homePrincipal.rutaPrincipal + values.rutas.rutas.homePrincipal.venta, "forward");
      }
    } else {
      const response: any = await actualizarPedido(nuevaData);

      if (response.success) {
        listarPedido(pedidoId.id);
        setPedidoAgregar([]);
        setDetallePedidoAgregar(new PedidoClass());
        setPedidoLista(new PedidoClass());
        await generarComanda(response);
      }
    }
  };

  const generarComanda = async (response: any) => {
    try {
      if (
        response.success &&
        response.data?.objeto?.data &&
        Array.isArray(response.data.objeto.data)
      ) {
        const dataComandas = response.data.objeto.data;

        const pdfs = dataComandas
          .map((item: any) => item.objeto)
          .filter(
            (base64: any) => typeof base64 === "string" && base64.length > 0
          );

        if (pdfs.length > 0) {
          setPdfsBase64(pdfs); // Aquí guardamos todos los PDF en estado
          showToast(`Se generaron ${pdfs.length} comandas`, 3000, "success");
        } else {
          showToast("No se encontraron archivos PDF válidos", 3000, "warning");
        }
      } else {
        showToast("Respuesta inválida al generar comandas", 3000, "danger");
      }
    } catch (error) {
      console.error("Error al generar la comanda:", error);
      showToast("Error al generar la comanda", 3000, "danger");
    }
  };

  const generarPreCuenta = async () => {
    try {
      const nuevaData = {
        id: pedidoId.id,
        fecha_creacion: new Date().toISOString().split("T")[0],
        hora_creacion: new Date().toTimeString().split(" ")[0],
        hora_pedido: new Date().toTimeString().split(" ")[0],
        fecha_pedido: new Date().toISOString().split("T")[0],
        // mesa_id: mesaId.idMesa,
        nombre_mesa: pedidoLista.nombre_mesa,
        nombre_salon: pedidoLista.nombre_salon,
        impresora_id: pedidoLista.impresora_id,
        mesa_id: mesaId.idMesa,
        detallePedido: detallesAgrupados,
      };
      console.log("NUEVA DATA", nuevaData);

      // return ;
      const response: any = await generarPreCuentaPDF(nuevaData);
      if (response.success) {
        showToast("Pre-cuenta generada correctamente", 3000, "success");

        if (response.data.objeto) {
          const base64PDF = response.data.objeto;
          setMostrarPdf(true);
          setPdfBase64(base64PDF);
        }
      } else {
        showToast(
          response.message || "Error al generar la pre-cuenta",
          3000,
          "danger"
        );
      }
    } catch (error) {
      showToast("Error al generar la pre-cuenta", 3000, "danger");
    }
  };

  const confirmarNotas = () => {
    const textoNotasMarcadas = notasSeleccionados
      .filter((n) => n.marcado)
      .map((n) => n.nota)
      .join(", ");
    let exiteDetalle = pedidoAgregar.find(
      (item: any) => item.idUnico === productoNotas.idUnico
    );
    if (exiteDetalle) {
      const nuevoDetalle: any = {
        ...exiteDetalle,
        comentario: textoNotasMarcadas,
        contieneNotas: true,
      };
      const nuevoDetallePedido = pedidoAgregar.map((item: any) => {
        if (item.idUnico === nuevoDetalle.idUnico) {
          return nuevoDetalle;
        }
        return item;
      });
      setPedidoAgregar(nuevoDetallePedido);
    }
    setIsModalNotas(false);
  };

  const consultarNotas = async (detalle: any) => {
    const response: any = await obtenerNotas(detalle);
    if (response.success) {
      const notas = response.data.objeto.map((nota: any) => ({
        nota: nota.notas,
        marcado: false,
        idUnico: crypto.randomUUID(),
      }));
      const textoNotasMarcadas = notas.map((n: any) => n.nota).join(", ");

      const listaNotas = textoNotasMarcadas.split(",").map((nota: any) => ({
        nota: nota.trim(),
        marcado: false,
        idUnico: crypto.randomUUID(),
      }));
      return listaNotas;
    }
  };

  const generarNotasMarcadas = (notas: any) => {
    const listaNotas = notas.split(",").map((nota: any) => ({
      nota: nota.trim(),
      marcado: true,
      idUnico: crypto.randomUUID(),
    }));
    return listaNotas;
  };

  const abrirModalNotas = async (detalle: any) => {
    setNotasSeleccionados([]);
    setProductoNotas(detalle);
    const notasMarcadas = generarNotasMarcadas(detalle.comentario);
    const listaNotas: any = await consultarNotas(detalle);
    const listaFinal = mantenerMarcados(notasMarcadas, listaNotas);
    setNotasSeleccionados(listaFinal);
    setIsModalNotas(true);
  };

  const registarNota = async () => {
    const registrarNuevaNota = Object.assign(new ProductoClass(), {
      ...registrarNota,
      idProducto: productoNotas.producto_id,
      notas: nuevaNota,
    });
    setRegistrarNota(registrarNuevaNota);
    const response = await registrarNotas(registrarNuevaNota);
    if (response.success) {
      const listaNotas: any = await consultarNotas(productoNotas);
      const listaFinal = mantenerMarcados(notasSeleccionados, listaNotas);
      setNotasSeleccionados(listaFinal);
      setNuevaNota("");
    }
  };

  const mantenerMarcados = (listaAnterior: any[], nuevaLista: any[]) => {
    return nuevaLista.map((nuevaNota) => {
      const notaAnterior = listaAnterior.find(
        (anterior) =>
          anterior.nota.trim().toLowerCase() ===
          nuevaNota.nota.trim().toLowerCase()
      );

      return {
        ...nuevaNota,
        marcado: notaAnterior?.marcado === true,
      };
    });
  };

  const handleCheckboxChange = (index: number, checked: boolean) => {
    const nuevasNotas = [...notasSeleccionados];
    nuevasNotas[index].marcado = checked;
    setNotasSeleccionados(nuevasNotas);
  };

  // const verDetalle = async (detalle: any) => {
  //   setPedidoDetalleSeleccionado(detalle);
  //   console.log("DETALLES", detalle);

  //   const response: any = await obtenerDetallePedido({
  //     id: detalle.pedido_id,
  //     producto_id: detalle.producto_presentacion_id,
  //   });
  //   console.log("DETALLE PEDIDO: ", response);

  //   if (response.success) {
  //     setPedidoDetalle(response.data.objeto);
  //     setIsModalDetalle(true);
  //   }
  // };
  const verDetalle = async (detalle: any) => {
    setPedidoDetalleSeleccionado(detalle);
    const response: any = await obtenerDetallePedido({
      id: detalle.pedido_id,
      producto_id: detalle.producto_presentacion_id,
    });
    if (response.success) {
      // Convertir los IDs del detalle en un array de números
      const idsDetalle = detalle.id
        .split(",")
        .map((id: string) => parseInt(id, 10))
        .filter((id: number) => !isNaN(id));
      //Filtrar el array de objeto por esos IDs
      const objetosFiltrados = response.data.objeto.filter((obj: any) =>
        idsDetalle.includes(obj.id)
      );

      //Guardar y abrir modal
      setPedidoDetalle(objetosFiltrados);
      setIsModalDetalle(true);
    }
  };

  const confirmarDetalle = () => {};

  const eliminarDetalle = async (detalle: any) => {
    const detalleFiltradoCompleto = pedidoLista.detallePedido.find((d: any) => {
      const ids = String(d.id).split(",");
      return ids.includes(String(detalle.id));
    });

    const detalleFiltrado = detalleFiltradoCompleto
      ? { ...detalleFiltradoCompleto, id: String(detalle.id), cantidad: 1 }
      : null;
    console.log("DETALLE FILTRADO: ", detalleFiltrado);

    if (detalleFiltrado) {
      const pedidoFiltrado = {
        ...pedidoLista,
        detallePedido: [detalleFiltrado],
      };
      // console.log(pedidoFiltrado);
      // return;
      const response: any = await eliminarDetallePedido(pedidoFiltrado);
      if (response.success) {
        setPedidoDetalle([]);

        const detalleResponse: any = await obtenerDetallePedido({
          id: detalle.pedido_id,
          producto_id: detalle.producto_presentacion_id,
        });

        if (detalleResponse.success) {
          const nuevaData = {
            ...detalleResponse.data.objeto,
          };
          setPedidoDetalle(detalleResponse.data.objeto);
        }
        listarPedido(id);
        console.log("RESPONSE: ", response);

        await generarComanda(response);
      }

      console.log("PEDIDO CON SOLO EL DETALLE SELECCIONADO", pedidoFiltrado);
    } else {
      console.warn("Detalle no encontrado en pedidoLista");
    }
  };

  const eliminarDetallePedidoCompleto = () => {
    solicitarAutorizacion({
      tipo_operacion: TipoOperacion.AnularPedido.para_correlativo,
      proceso: TipoOperacion.AnularPedido.para_cadena2,
      importe: 0,
      transaccion_id: pedidoId.id,
      accion: () => {
        // handleConfirmPedido();
        setMostrarAlertaStock(true);
      },
      norequiereaccion: () => {
        setShowAlertPedidoCompleto(true);
      },
    });
  };

  const eliminarNotaFront = async (notas: any) => {
    setShowAlert(true);
    let nota = {
      id: notas.idUnico,
      idProducto: productoNotas.producto_id,
      notas: notas.nota,
    };
    setEliminarNotaTrama(nota);
  };

  const handleConfirm = async () => {
    const response = await eliminarNota(eliminarNotaTrama);
    if (response.success) {
      abrirModalNotas(productoNotas);
    }
    setShowAlert(false);
  };

  const handleCancel = () => {
    setShowAlert(false);
  };

  const parseHora = (isoString: string): string => {
    const date = new Date(isoString);
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const seconds = date.getUTCSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const handleConfirmPedido = async (restablecerstockpedido?: number) => {
    try {
      const dataEliminarPedido = {
        id: pedidoId.id,
        mesa_id: mesaId.idMesa,
      };
      // const pedidoCompleto = pedidoLista;
      const pedidoCompleto = {
        ...pedidoLista,
        hora_creacion: parseHora(pedidoLista.hora_creacion),
        hora_pedido: parseHora(pedidoLista.hora_pedido),
        restablecerStock: restablecerstockpedido,
      };
      // console.log("PEDIDO COMPLETO: ", pedidoCompleto);
      // return;
      const response: any = await eliminarPedidoCompleto(pedidoCompleto);
      await generarComanda(response);
      // showToast( response.descripcion || "Pedido Cancelado Correctamente",
      //   3000,
      //   "success"
      // );
      // Mostrar modal de éxito
      setShowPedidoEliminadoModal(true);
      //router.push(values.rutas.rutas.homePrincipal.rutaPrincipal + values.rutas.rutas.homePrincipal.venta, "forward");
    } catch (error) {
      showToast("Error al eliminar el pedido", 3000, "danger");
    }
  };

  const actualizarCortesia = (index: number, checked: boolean) => {
    setPedidoAgregar((prevPedido) =>
      prevPedido.map((detalle, i) => {
        if (i === index) {
          let precioNuevo = checked ? 0 : detalle.precioOriginal;
          return {
            ...detalle,
            selectCortesia: checked,
            precio: precioNuevo,
          };
        }
        return detalle;
      })
    );
  };

  // Agrupamos los precios y sus cantidades
  const detallesAgrupados: DetallePedidoClass[] = [];
  pedidoLista.detallePedido.forEach((detalle: any) => {
    if (typeof detalle.precio === "string" && typeof detalle.id === "string") {
      const precios = detalle.precio
        .split(",")
        .filter((n: string) => n !== "")
        .map((n: string) => parseFloat(n))
        .filter((n: number) => !isNaN(n));

      const ids = detalle.id.split(",").filter((id: string) => id !== "");

      // Relaciona precios e IDs
      const itemsSeparados: { precio: number; id: string }[] = [];

      for (let i = 0; i < precios.length; i++) {
        itemsSeparados.push({
          precio: precios[i],
          id: ids[i] || "", // por si hay menos ids que precios
        });
      }

      // Agrupa por precio
      const conteo: { [precio: string]: { cantidad: number; ids: string[] } } =
        {};

      itemsSeparados.forEach((item) => {
        const key = item.precio.toString();
        if (conteo[key]) {
          conteo[key].cantidad++;
          conteo[key].ids.push(item.id);
        } else {
          conteo[key] = {
            cantidad: 1,
            ids: [item.id],
          };
        }
      });

      // Genera detalles agrupados
      Object.entries(conteo).forEach(([precioStr, data]) => {
        const precio = parseFloat(precioStr);
        detallesAgrupados.push({
          ...detalle,
          cantidad: data.cantidad,
          precio,
          mesa_id: mesaId,
          id: data.ids.join(","),
        });
      });
    } else {
      // Si el precio ya es número limpio
      detallesAgrupados.push({
        ...detalle,
      });
    }
  });

  const pedidoConAgrupado = {
    ...pedidoLista,
    detallePedido: detallesAgrupados,
  };

  const handleCancelPedido = () => {};

  return (
    <div className="detalle-pedido ">
      {LoadingComponent}
      {ToastComponent}
      {ToastAutorizacion}
      {LoadingAutorizacion}
      {ToastUseToastComponent}
      <div className="pedido-container-detalle">
        {mostarInformacion && (
          <IonCard className="header-card-detalle">
            <div className="div-card-cabecera-detalle fadeInDown">
              <div className="div-titulo-card-cabecera">
                <h3 className="titulo-detalle ">{pedidoLista.nombre_salon}</h3>
                <h4 className="mesa-detalle">{pedidoLista.nombre_mesa}</h4>
                {mesaId.idMesa == 0 && (
                  <IonItem>
                    <IonLabel position="stacked">Nombre del cliente</IonLabel>
                    <IonInput
                      type="text"
                      className="cliente-detalle-input"
                      value={pedidoLista.nombre_cliente || clienteNombre}
                      onIonInput={(e) => setClienteNombre(e.detail.value!)}
                      placeholder="Público en General"
                    />
                  </IonItem>
                )}
              </div>
              <div>
                {pedidoAgregar.length > 0 && (
                  <CustomButton
                    text="CONFIRMAR"
                    onClick={confirmarPedido}
                    expand={"full"}
                    className=""
                  />
                )}
                {pdfsBase64.map((pdf, index) => (
                  <PdfViewer key={index} base64PDF={pdf} />
                ))}
              </div>
              <div>
                {pedidoId.id !== 0 && (
                  <div className="tooltip-icon">
                    <IonIcon
                      icon={print}
                      slot="icon-only"
                      className="icono-detalle tamanio-icon icono-ver"
                      onClick={generarPreCuenta}
                    />
                    <span className="tooltip-text">Pre Cuenta</span>
                  </div>
                )}
                {mostrarPdf && <PdfViewer base64PDF={pdfBase64} />}
                {pedidoId.id !== 0 && (
                  <div className="tooltip-icon" style={{ position: "relative" }}>
                    <IonIcon
                      icon={trashOutline}
                      slot="icon-only"
                      className="icono-detalle tamanio-icon icono-ver"
                      onClick={() => eliminarDetallePedidoCompleto()}
                    ></IonIcon>
                    <span  className="tooltip-text" style={{ position: "absolute", left: "-12px", }} >
                      Eliminar Pedido
                    </span>
                  </div>
                )}
                <CustomAlert
                  isOpen={showAlertPedidoCompleto}
                  header="Anular Pedido"
                  message="¿Estás seguro de que deseas anular este pedido?"
                  onConfirm={handleConfirmPedido}
                  onCancel={handleCancelPedido}
                  onDidDismiss={() => setShowAlertPedidoCompleto(false)}
                />

                <CustomAlert
                  isOpen={showPedidoEliminadoModal}
                  header="Éxito"
                  message="Pedido eliminado correctamente"
                  onConfirm={() => {
                    setShowPedidoEliminadoModal(false);
                    router.push(
                      values.rutas.rutas.homePrincipal.rutaPrincipal +
                        values.rutas.rutas.homePrincipal.venta,
                      "forward"
                    );
                  }}
                />

                <CustomAlert
                  isOpen={showPedidoCreadoModal}
                  header="Éxito"
                  message="Pedido Registrado correctamente"
                  onConfirm={() => {
                    setShowPedidoCreadoModal(false);
                    router.push(
                      values.rutas.rutas.homePrincipal.rutaPrincipal +
                        values.rutas.rutas.homePrincipal.venta,
                      "forward"
                    );
                  }}
                />
              </div>
            </div>
            <div className="separador"></div>
          </IonCard>
        )}

        <div className="div-detalle-scroll">
          <div className="div-detalle-productos-scroll">
            <IonList>
              {pedidoAgregar &&
                pedidoAgregar.map((detalle: any, index: any) => (
                  <IonItem className="item-detalle-agregar" key={index}>
                    <div className="div-detalle-lista ">
                      <div className="div-item-detalle-agregar">
                        <div className="div-item-input-detalle-agregar">
                          <IonInput
                            type="text"
                            placeholder="1"
                            className="input-detalle-agregar"
                            value={detalle.cantidad}
                            onIonChange={(e) =>
                              actualizarStockManual(
                                detalle.idUnico,
                                parseInt(e.detail.value!, 10)
                              )
                            }
                          ></IonInput>
                          <span className="span-detalle-agregar">
                            <IonButton
                              className="button-mas-agregar"
                              onClick={() => actualizarStock(detalle)}
                            >
                              +
                            </IonButton>
                            <IonButton
                              className="button-menos-agregar"
                              onClick={() => disminuirStock(detalle)}
                            >
                              -
                            </IonButton>
                          </span>
                          <div className="span-detalle-agregar-02">
                            <h6 className="titulo-detalle-lista tamanio-texto">
                              {detalle.descripcion}
                              <span className="span-etiquetas-detalle-lista tamanio-texto-etiquetas">
                                {detalle.codigoPresentacion}
                              </span>
                            </h6>
                            <p className="subtitulo-detalle-lista tamanio-texto">
                              S/{" "}
                              {Number(detalle.precio).toFixed(
                                values.numeros.decimales
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="span-precio-detalle-lista tamanio-texto">
                          <div className="div-botones-detalle-agregar">
                            {detalle.cortesia == 0 && (
                              <IonCheckbox
                                checked={detalle.selectCortesia}
                                onIonChange={(e) =>
                                  actualizarCortesia(index, e.detail.checked)
                                }
                                style={{
                                  transform: "scale(1.3)",
                                  marginRight: "8px",
                                }}
                              ></IonCheckbox>
                            )}

                            <IonButton
                              className="button-icono-notas"
                              onClick={() => abrirModalNotas(detalle)}
                            >
                              <IonIcon
                                slot="icon-only"
                                icon={chatboxOutline}
                              ></IonIcon>
                            </IonButton>
                            <IonButton
                              className="button-icono-eliminar"
                              onClick={() => eliminarPedido(detalle)}
                            >
                              <IonIcon
                                slot="icon-only"
                                icon={trashOutline}
                              ></IonIcon>
                            </IonButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  </IonItem>
                ))}
            </IonList>
          </div>
          {pedidoAgregar.length > 0 && (
            <IonItem lines="full">
              <IonLabel>
                <strong></strong>
              </IonLabel>
              <IonLabel className="total">
                {/* Total: S/ {total} */}
                Total: S/ {total.toFixed(values.numeros.decimales)}
              </IonLabel>
            </IonItem>
          )}
          <div className="div-productos-conf-scroll">
            {pedidoLista && pedidoLista.detallePedido.length > 0 ? (
              // pedidoLista.detallePedido.map((detalle: any, index: any) => (
              //   <IonList>
              //     <IonItem
              //       className="item-detalle-lista"
              //       key={index}
              //       onClick={() => verDetalle(detalle)}
              //     >
              //       <div className="div-detalle-lista fadeInDown">
              //         <div>
              //           <div>
              //             <span className="span-detalle-lista">
              //               <h6 className="titulo-detalle-lista tamanio-texto">
              //                 {detalle.descripcion}
              //                 <span className="span-etiquetas-detalle-lista tamanio-texto-etiquetas">
              //                   {detalle.codigoPresentacion}
              //                 </span>
              //               </h6>
              //               <p className="subtitulo-detalle-lista tamanio-texto">
              //                 {detalle.cantidad} Unidad(es) en S/ {detalle.precio}{" "}
              //                 | Unidad
              //               </p>
              //             </span>
              //             <span className="span-precio-detalle-lista tamanio-texto">
              //               S/{" "}
              //               {/* {Number(detalle.precio * detalle.cantidad)} */}
              //               {Number(detalle.precio * detalle.cantidad).toFixed(
              //                 values.numeros.decimales
              //               )}
              //             </span>
              //           </div>
              //         </div>
              //       </div>
              //     </IonItem>
              //   </IonList>
              // ))
              detallesAgrupados.map((detalle: any, index: number) => (
                <IonList key={index}>
                  <IonItem
                    className="item-detalle-lista"
                    onClick={() => verDetalle(detalle)}
                  >
                    <div className="div-detalle-lista fadeInDown">
                      <div>
                        <span className="span-detalle-lista">
                          <h6 className="titulo-detalle-lista tamanio-texto">
                            {detalle.descripcion}
                            <span className="span-etiquetas-detalle-lista tamanio-texto-etiquetas">
                              {detalle.codigoPresentacion}
                            </span>
                          </h6>
                          <p className="subtitulo-detalle-lista tamanio-texto">
                            {detalle.cantidad} Unidad(es) en S/ {detalle.precio}{" "}
                            | Unidad
                          </p>
                        </span>
                        <span className="span-precio-detalle-lista tamanio-texto">
                          S/{" "}
                          {Number(detalle.precio * detalle.cantidad).toFixed(
                            values.numeros.decimales
                          )}
                        </span>
                      </div>
                    </div>
                  </IonItem>
                </IonList>
              ))
            ) : (
              <>
                {mostarInformacion && (
                  <div className="div-lista-vacia">
                    <div className="div-titulo-vacio">
                      <IonIcon
                        icon={fastFoodOutline}
                        className="icon-datos-vacio"
                      />
                      <h5>Agregue productos</h5>
                      <h6>
                        Seleccione categorías y productos del panel de la
                        izquierda
                      </h6>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <ReusableModal
        isOpen={isModalNotas}
        onClose={() => setIsModalNotas(false)}
        onConfirm={confirmarNotas}
        title=""
        cancelText="Cerrar"
        confirmText="Guardar"
        classN="modal-notas"
      >
        <div>
          {productoNotas && (
            <div className="ion-padding">
              <h6 className="titulo-notas tamanio-texto">
                {productoNotas.descripcion}
                <span className="span-etiquetas-detalle-lista tamanio-texto-etiquetas">
                  {productoNotas.codigoPresentacion}
                </span>
              </h6>
              <div>
                <IonItem className="item-nota">
                  <CustomInput
                    label="Agregar Nota"
                    type="text"
                    value={nuevaNota}
                    onIonChange={(e) => setNuevaNota(e.detail.value!)}
                    placeholder="Ingrese una nueva nota"
                    className="color-input-app"
                    onValidate={setIsUsernameValid}
                    labelPlacement="floating"
                  />
                </IonItem>
                <div className="div-button-registrar-nota">
                  <CustomButton
                    text="Registrar Nota"
                    onClick={registarNota}
                    expand={"full"}
                    className="button-registrar-nota"
                  />
                </div>
              </div>
              <div>
                <div>
                  <h6>Seleccionar:</h6>
                </div>
                <div className="div-checkbox-notas">
                  {notasSeleccionados.map((nota, index) => (
                    <div className="div-checkbox-notas-01">
                      <IonCheckbox
                        key={index}
                        labelPlacement="end"
                        class="checkbox-seleccionado"
                        checked={nota.marcado}
                        onIonChange={(e) =>
                          handleCheckboxChange(index, e.detail.checked)
                        }
                      >
                        <IonLabel class="label-checkbox-notas">
                          {nota.nota}
                        </IonLabel>
                      </IonCheckbox>
                      {!nota.marcado && (
                        <IonIcon
                          icon={trashOutline}
                          className="icono-eliminar-nota"
                          onClick={() => eliminarNotaFront(nota)}
                        ></IonIcon>
                      )}
                    </div>
                  ))}
                  <CustomAlert
                    isOpen={showAlert}
                    header="Eliminar Nota"
                    message="¿Estás seguro de que deseas eliminar este nota?"
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                    onDidDismiss={() => setShowAlert(false)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </ReusableModal>

      <ReusableModal
        isOpen={isModalDetalle}
        onClose={() => setIsModalDetalle(false)}
        onConfirm={confirmarDetalle}
        title=""
        cancelText="Cerrar"
        confirmText=""
        classN="modal-notas"
      >
        <div>
          {pedidoDetalle && (
            <div className="">
              <h6 className="titulo-notas tamanio-texto">DETALLE DE PEDIDO:</h6>
              <h6 className="titulo-notas tamanio-texto">
                {pedidoDetalleSeleccionado.descripcion}
                <span className="span-etiquetas-detalle-lista tamanio-texto-etiquetas">
                  {pedidoDetalleSeleccionado.codigoPresentacion}
                </span>
              </h6>
              <div>
                <IonList>
                  {[...pedidoDetalle]
                    .sort((a, b) => {
                      if (a.marca_baja === 9 && b.marca_baja !== 9) return 1;
                      if (a.marca_baja !== 9 && b.marca_baja === 9) return -1;
                      const fechaA = new Date(
                        `${a.fecha_detalle}T${new Date(a.hora_detalle)
                          .toTimeString()
                          .slice(0, 8)}`
                      );
                      const fechaB = new Date(
                        `${b.fecha_detalle}T${new Date(b.hora_detalle)
                          .toTimeString()
                          .slice(0, 8)}`
                      );
                      return fechaB.getTime() - fechaA.getTime();
                    })
                    .map((detalle: any, index: any) => (
                      <IonItem className="item-detalle-lista" key={index}>
                        <div className="div-detalle-lista fadeInDown">
                          <div>
                            <div>
                              <span className="span-detalle-lista">
                                <h6 className="titulo-detalle-lista tamanio-texto">
                                  <IonIcon
                                    icon={calendarOutline}
                                    className="icon-detalle-producto"
                                  />{" "}
                                  {detalle.fecha_detalle}
                                  {/* <span className=""> <IonIcon icon={timeOutline} className="icon-detalle-producto"/> {new Date(detalle.hora_creacion).toTimeString().slice(0, 8)}</span> */}
                                  <span className="">
                                    {" "}
                                    <IonIcon
                                      icon={timeOutline}
                                      className="icon-detalle-producto"
                                    />{" "}
                                    {detalle.hora_detalle}
                                  </span>
                                </h6>
                                <p className="subtitulo-detalle-lista tamanio-texto">
                                  {detalle.estado == 3 ? (
                                    <span className="span-etiquetas-detalle-lista-producto-anulado tamanio-texto-etiquetas">
                                      ANULADO
                                    </span>
                                  ) : (
                                    <span className="span-etiquetas-detalle-lista-producto tamanio-texto-etiquetas">
                                      PENDIENTE
                                    </span>
                                  )}
                                  <span> :: {detalle.comentario}</span>
                                </p>
                              </span>
                              <span className="span-precio-detalle-lista tamanio-texto">
                                <div className="span-precio-detalle-lista tamanio-texto">
                                  <div className="div-botones-detalle-agregar">
                                    {detalle.estado == 3 ? (
                                      <></>
                                    ) : (
                                      <IonButton
                                        className="button-icono-eliminar"
                                        onClick={() => eliminarDetalle(detalle)}
                                      >
                                        <IonIcon
                                          slot="icon-only"
                                          icon={trashOutline}
                                        ></IonIcon>
                                      </IonButton>
                                    )}
                                  </div>
                                </div>
                              </span>
                            </div>
                          </div>
                        </div>
                      </IonItem>
                    ))}
                </IonList>
              </div>
            </div>
          )}
        </div>
      </ReusableModal>

      <AuthorizationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={enviarPin}
      />
      <IonAlert
        isOpen={mostrarAlertaStock}
        onDidDismiss={() => setMostrarAlertaStock(false)}
        header="¿Restablecer stock del pedido?"
        message="¿Deseas devolver el stock al anular el pedido?"
        buttons={[
          {
            text: "Sí",
            handler: () => {
              // setrestablecerStock(RestablecerStock.si);
              handleConfirmPedido(RestablecerStock.si);
              setMostrarAlertaStock(false);
            },
          },
          {
            text: "No",
            handler: () => {
              // setrestablecerStock(RestablecerStock.no);
              handleConfirmPedido(RestablecerStock.no);
              setMostrarAlertaStock(false);
            },
          },
        ]}
      />
      {mostarInformacion && (
        <IonFooter className="footer">
          {/* <IonButton expand="full" color="success" className="btn-total"
            onClick={() =>
                router.push(
                  values.rutas.rutas.homePrincipal.rutaPrincipal +
                    values.rutas.rutas.homePrincipal.pagoVenta,
                  "forward"
                )
              }
            >
            <IonIcon icon={cash} slot="start" />
            S/ {pedidoLista.monto_total.toFixed(values.numeros.decimales)}
          </IonButton> */}

          {pedidoId.id !== 0 && (
            <IonButton
              expand="full"
              color="success"
              className="btn-total"
              onClick={() => {
                const pedidoStr = encodeURIComponent(
                  JSON.stringify(pedidoConAgrupado)
                );
                router.push(
                  values.rutas.rutas.homePrincipal.rutaPrincipal +
                    values.rutas.rutas.homePrincipal.pagoVenta +
                    `?pedido=${pedidoStr}`,
                  "forward"
                );
              }}
            >
              <IonIcon icon={cash} slot="start" />
              S/ {pedidoLista.monto_total.toFixed(values.numeros.decimales)}
            </IonButton>
          )}
        </IonFooter>
      )}
    </div>
  );
};

export default DetallePedido;
