import { useRequest } from "./useRequest";
import { RegistrarVentaPost } from "../services/pagoVentas";

export const usePagoVentas = () => {
  const { makeRequest, loading, error, LoadingComponent, ToastComponent } = useRequest();

  return {
    RegistrarVenta: (venta: any) => makeRequest(RegistrarVentaPost, [venta]),
    loading,
    error,
    LoadingComponent,
    ToastComponent,
  };
};