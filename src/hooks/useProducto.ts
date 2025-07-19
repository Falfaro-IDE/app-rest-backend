import { useRequest } from "./useRequest";
import { actualizarPresentacionPost, actualizarProductoPost,crearPresentacionPost, crearProductoPost, obtenerCategoriasGet, obtenerPresentacionesGet, obtenerPresentacionesTextoGet } from "../services/productoServices";

export const useProducto = () => {
  const { makeRequest, loading, error, LoadingComponent,showToast, ToastComponent } = useRequest();
  return { 
   
    obtenerPresentaciones: (params: any) => makeRequest(() => obtenerPresentacionesGet(params), [params]),
    obtenerPresentacionesTexto: (texto: any, tipo?: number) => makeRequest(() => obtenerPresentacionesTextoGet(texto, tipo), [texto, tipo]),
    obtenerCategorias  : () => makeRequest(obtenerCategoriasGet),
    actualizarProducto: (productoData: any) => makeRequest(() => actualizarProductoPost(productoData)),
    actualizarPresentacion: (presentacionData: any) => makeRequest(() => actualizarPresentacionPost(presentacionData)),
    crearProducto: (productoData: any) => makeRequest(() => crearProductoPost(productoData)),
    crearPresentacion: (presentacionData: any) => makeRequest(() => crearPresentacionPost(presentacionData)),

    
    loading, 
    error, 
    LoadingComponent, 
    showToast, 
    ToastComponent 
  };
};