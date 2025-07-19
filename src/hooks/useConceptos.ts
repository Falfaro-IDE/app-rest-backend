import { useRequest } from "./useRequest";
import { obtenerConceptosComprobantesGet, obtenerConceptosPagoCompraGet} from "../services/conceptosService";

export const useConceptos = () => {
  const { makeRequest, loading, error, LoadingComponent,showToast, ToastComponent } = useRequest();
  return { 
   
    obtenerConceptos: (params: any) => makeRequest(() => obtenerConceptosComprobantesGet(params), [params]),
    obtenerConceptosPagoCompra: (params: any) => makeRequest(() => obtenerConceptosPagoCompraGet(params), [params]),
    
    // crearCompra: (CompraData: any) => makeRequest(() => crearCompraPost(CompraData)),
    // actualizarInsumo: (InsumoData: any) => makeRequest(() => actualizarInsumoPost(InsumoData)),
    

    loading, 
    error, 
    LoadingComponent, 
    showToast, 
    ToastComponent 
  };
};