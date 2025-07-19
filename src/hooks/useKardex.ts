import { KardexClass } from "../models/clases/Kardex";
import { listarKardexGet } from "../services/kardexService";
import { useRequest } from "./useRequest";

export const useKardex = () => {
  const { makeRequest, loading, error, LoadingComponent,showToast, ToastComponent } = useRequest();

    return { 
        listarKardexHooks: (kardex:KardexClass,showLoad = true) => makeRequest(listarKardexGet, [kardex], showLoad),
        loading, 
        error, 
        LoadingComponent, 
        showToast, 
        ToastComponent 
    };


}