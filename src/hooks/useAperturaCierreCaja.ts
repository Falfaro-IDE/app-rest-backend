import { useRequest } from "./useRequest";
import {  aperturarCajaPost,  cerrarCajaPost,  validarAperturaUsuarioGet, obtenerMontosCajaGet, arqueoCajaGet } from "../services/aperturaCierreCajaService";

export const useAperturaCierreCaja = () => {
  const { makeRequest, loading, error, LoadingComponent, showToast, ToastComponent } = useRequest();

  return { 
    aperturarCaja: (aperturaData: any) => makeRequest(() => aperturarCajaPost(aperturaData)),
    obtenerMontosCaja: (caja_apertura_cierre_id: number, soloMetodosPagos?: number) => makeRequest(() => obtenerMontosCajaGet(caja_apertura_cierre_id, soloMetodosPagos)),    
    cerrarCaja: (cierreData: any) => makeRequest(() => cerrarCajaPost(cierreData)),
    validarAperturaUsuario: () => makeRequest(() => validarAperturaUsuarioGet()),
    arqueoCaja: (apertura_cierre_caja_id: number) => makeRequest(() => arqueoCajaGet(apertura_cierre_caja_id)),

    loading,
    error,
    LoadingComponent,
    showToast,
    ToastComponent 
  };
};
