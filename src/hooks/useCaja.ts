import { useRequest } from "./useRequest";
import { obtenerCajasGet, crearCajasPost, actualizarCajaPost } from "../services/cajasService";

export const useCaja = () => {
  const { makeRequest, loading, error, LoadingComponent,showToast, ToastComponent } = useRequest();
  return { 
   
    obtenerCajas: (perfil: number) => makeRequest(() => obtenerCajasGet(perfil)),
    crearCaja: (CajaData: any) => makeRequest(() => crearCajasPost(CajaData)),
    actualizarCaja: (CajaData: any) => makeRequest(() => actualizarCajaPost(CajaData)),
    

    loading, 
    error, 
    LoadingComponent, 
    showToast, 
    ToastComponent 
  };
};