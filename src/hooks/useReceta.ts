import { useRequest } from "./useRequest";
import { obtenerRecetaGet, crearRecetaPost, actualizarRecetaPost } from "../services/recetaServices";

export const useReceta = () => {
  const { makeRequest, loading, error, LoadingComponent,showToast, ToastComponent } = useRequest();
  return { 
   
    obtenerReceta: (params: any) => makeRequest(() => obtenerRecetaGet(params), [params]),
    crearReceta: (RecetaData: any) => makeRequest(() => crearRecetaPost(RecetaData)),
    actualizarReceta: (RecetaData: any) => makeRequest(() => actualizarRecetaPost(RecetaData)),

    loading, 
    error, 
    LoadingComponent, 
    showToast, 
    ToastComponent 
  };
};