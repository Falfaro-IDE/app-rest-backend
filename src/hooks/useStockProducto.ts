import { useRequest } from "./useRequest";
import { obtenerStockProductoGet } from "../services/stockProducto";

export const useStockProducto = () => {
  const { makeRequest, loading, error, LoadingComponent,showToast, ToastComponent } = useRequest();
  return { 
   
    obtenerStockProducto: (params: any) => makeRequest(() => obtenerStockProductoGet(params), [params]),

    loading, 
    error, 
    LoadingComponent, 
    showToast, 
    ToastComponent 
  };
};