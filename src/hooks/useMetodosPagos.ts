import { useRequest } from "./useRequest";
import { obtenerMetodosPagosGet } from "../services/metodosPagosService";

export const useMetodosPagos = () => {
  const { makeRequest, loading, error, LoadingComponent, ToastComponent } = useRequest();

  return {
    obtenerMetodosPagos: () => makeRequest(obtenerMetodosPagosGet),
    loading,
    error,
    LoadingComponent,
    ToastComponent,
  };
};