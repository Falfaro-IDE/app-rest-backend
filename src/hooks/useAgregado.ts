import { useRequest } from "./useRequest";
import { obtenerAgregadoGet, crearAgregadoPost, actualizarAgregadoPost } from "../services/agregadosService";

export const useAgregado = () => {
  const { makeRequest, loading, error, LoadingComponent,showToast, ToastComponent } = useRequest();
  return { 
   
    obtenerAgregados: (params: any) => makeRequest(() => obtenerAgregadoGet(params), [params]),
    crearAgregado: (AgregadoData: any) => makeRequest(() => crearAgregadoPost(AgregadoData)),
    actualizarAgregado: (AgregadoData: any) => makeRequest(() => actualizarAgregadoPost(AgregadoData)),

    loading, 
    error, 
    LoadingComponent, 
    showToast, 
    ToastComponent 
  };
};