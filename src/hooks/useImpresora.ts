import { useRequest } from "./useRequest";
import { obtenerImpresorasGet } from "../services/impresoraService";

export const useImpresora = () => {
  const { makeRequest, loading, error, LoadingComponent,showToast, ToastComponent } = useRequest();
  return { 
   
    obtenerImpresoras: () => makeRequest(() => obtenerImpresorasGet()),
    

    loading, 
    error, 
    LoadingComponent, 
    showToast, 
    ToastComponent 
  };
};