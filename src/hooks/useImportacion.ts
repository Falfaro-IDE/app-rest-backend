import { useRequest } from "./useRequest";
import { importarProductosPresentacionesPost, importarInsumosPost } from "../services/importacionService";
import { InsumoPreparado } from "../models/clases/Insumo";

export const useImportacion = () => {
  const { makeRequest, loading, error, LoadingComponent,showToast, ToastComponent } = useRequest();
  return { 
   
    importarProductosPresentaciones: (payload: { productos: any[]; presentaciones: any[] }) => makeRequest(() => importarProductosPresentacionesPost(payload), [payload]),
    importarInsumos: (insumos: InsumoPreparado[]) => makeRequest(() => importarInsumosPost(insumos), [insumos]),



    loading, 
    error, 
    LoadingComponent, 
    showToast, 
    ToastComponent 
  };
};