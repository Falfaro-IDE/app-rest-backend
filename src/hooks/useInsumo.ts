import { useRequest } from "./useRequest";
import { obtenerInsumosGet, crearInsumoPost, actualizarInsumoPost } from "../services/insumoService";

export const useInsumo = () => {
  const { makeRequest, loading, error, LoadingComponent,showToast, ToastComponent } = useRequest();
  return { 
   
    obtenerInsumos: (params: any) => makeRequest(() => obtenerInsumosGet(params), [params]),
    crearInsumo: (InsumoData: any) => makeRequest(() => crearInsumoPost(InsumoData)),
    actualizarInsumo: (InsumoData: any) => makeRequest(() => actualizarInsumoPost(InsumoData)),
    

    loading, 
    error, 
    LoadingComponent, 
    showToast, 
    ToastComponent 
  };
};