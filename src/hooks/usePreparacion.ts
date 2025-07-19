import { useRequest } from "./useRequest";
import {actualizarPreparacionPost, obtenerPreparacionesGet } from "../services/preparacionService";

export const usePreparaciones = () => {
  const { makeRequest, loading, error, LoadingComponent,showToast, ToastComponent } = useRequest();
  return { 
   
    actualizarPreparacion: (params: any) => makeRequest(() => actualizarPreparacionPost(params), [params]),
    // obtenerPreparaciones: () => makeRequest(obtenerPreparacionesGet),
    obtenerPreparaciones : (fecha: string) => makeRequest(() => obtenerPreparacionesGet(fecha)),


    loading, 
    error, 
    LoadingComponent, 
    showToast, 
    ToastComponent 
  };
};