import { obtenerProveedoresGet } from "../services/proveedorService";
import { useRequest } from "./useRequest";

export const useProveedores = () => {
  const { makeRequest, loading, error, LoadingComponent,showToast, ToastComponent } = useRequest();
  return { 
   
    obtenerProveedores: (params: any) => makeRequest(() => obtenerProveedoresGet(params), [params]),


    loading, 
    error, 
    LoadingComponent, 
    showToast, 
    ToastComponent 
  };
};