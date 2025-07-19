import { useRequest } from "./useRequest";
import { obtenerAreaProduccionGet } from "../services/areaProduccion";

export const useAreaProduccion = () => {
  const { makeRequest, loading, error, LoadingComponent,showToast, ToastComponent } = useRequest();
  return { 

    obtenerAreaProduccion  : () => makeRequest(obtenerAreaProduccionGet),
    
    loading, 
    error, 
    LoadingComponent, 
    showToast, 
    ToastComponent 
  };
};