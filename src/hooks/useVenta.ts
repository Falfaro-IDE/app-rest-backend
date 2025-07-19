import { useRequest } from "./useRequest";
import { actualizarPedidoPost, eliminarDetallePedidoPost, eliminarNotaPost, eliminarPedidoCompletoPost, generarPreCuentaPost, obtenerCategoriasGet, obtenerDetallePedidoGet, obtenerMesasGet, obtenerNotasGet, obtenerPedidosGet, obtenerPisosGet, obtenerPresentacionesGet, obtenerPresentacionesTextoGet, registrarNotasPost, registrarPedidoPost, separaMesasPost } from "../services/ventaServices";
import { PedidoClass } from "../models/clases/Pedido";
import { ProductoClass } from "../models/clases/Producto";

export const useVenta = () => {
  const { makeRequest, loading, error, LoadingComponent,showToast, ToastComponent } = useRequest();

  return { 
    obtenerPisos         : (showLoad = false) => makeRequest(obtenerPisosGet,[], showLoad),
    obtenerMesas         : (piso:any, showLoad = false) => makeRequest(obtenerMesasGet, [piso],showLoad),
    separaMesas          : (mesa:any, showLoad = true) => makeRequest(separaMesasPost, [mesa],showLoad),
    obtenerPresentaciones: (categoria:any) => makeRequest(obtenerPresentacionesGet, [categoria]),
    obtenerPresentacionesTexto: (texto:any) => makeRequest(obtenerPresentacionesTextoGet, [texto]),
    obtenerCategorias     : () => makeRequest(obtenerCategoriasGet),
    registrarPedido       : (pedido:PedidoClass, showLoad = true) => makeRequest(registrarPedidoPost, [pedido],showLoad),
    generarPreCuentaPDF       : (pedido:any, showLoad = true) => makeRequest(generarPreCuentaPost, [pedido],showLoad),
    obtenerNotas          : (producto:ProductoClass, showLoad = true) => makeRequest(obtenerNotasGet, [producto],showLoad, false, true),
    registrarNotas        : (producto:ProductoClass, showLoad = true, ) => makeRequest(registrarNotasPost, [producto],showLoad, true, true),
    obtenerPedidos        : (producto:any, showLoad = false, ) => makeRequest(obtenerPedidosGet, [producto],showLoad, false, true),
    actualizarPedido      : (pedido:PedidoClass, showLoad = true) => makeRequest(actualizarPedidoPost, [pedido],showLoad), 
    obtenerDetallePedido  : (pedido:any, showLoad = true) => makeRequest(obtenerDetallePedidoGet, [pedido],showLoad, false, true),
    eliminarDetallePedido : (detalle:any, showLoad = true) => makeRequest(eliminarDetallePedidoPost, [detalle],showLoad, true, true),
    eliminarPedidoCompleto : (pedido:any, showLoad = true) => makeRequest(eliminarPedidoCompletoPost, [pedido],showLoad, true, true),
    eliminarNota          : (nota:any, showLoad = false) => makeRequest(eliminarNotaPost, [nota],showLoad, true, true),
    loading, 
    error, 
    LoadingComponent, 
    showToast, 
    ToastComponent 
  };
};