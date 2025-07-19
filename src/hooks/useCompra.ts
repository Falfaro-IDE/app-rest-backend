import { useRequest } from "./useRequest";
import { obtenerComprasGet, crearCompraPost } from "../services/compraService";
import { CompraRegistrarDto } from "../models/clases/Compra";

export const useCompra = () => {
  const { makeRequest, loading, error, LoadingComponent,showToast, ToastComponent } = useRequest();
  return { 
   
    obtenerCompras: (params: CompraRegistrarDto,showLoad = true) => makeRequest(() => obtenerComprasGet(params), [params], showLoad),
    crearCompra: (CompraData: any) => makeRequest(() => crearCompraPost(CompraData)),
    // actualizarInsumo: (InsumoData: any) => makeRequest(() => actualizarInsumoPost(InsumoData)),
    

    loading, 
    error, 
    LoadingComponent, 
    showToast, 
    ToastComponent 
  };
};