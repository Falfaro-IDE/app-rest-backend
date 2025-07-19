import { useRequest } from "./useRequest";
import { obtenerGananciasGet } from "../services/gananciasService";

export const useGanancias = () => {
  const { makeRequest, loading, error, LoadingComponent,showToast, ToastComponent } = useRequest();
  return { 
   
    obtenerGanancias: (params: any) => makeRequest(() => obtenerGananciasGet(params), [params]),

    loading, 
    error, 
    LoadingComponent, 
    showToast, 
    ToastComponent 
  };
};