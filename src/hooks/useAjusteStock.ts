import { AjusteStockClass } from "../models/clases/AjusteStock";
import { anularAjusteStockPost, listarAjusteStockGet, registrarAjusteStockPost } from "../services/ajusteStockServices";
import { useRequest } from "./useRequest";

export const useAjusteStock = () => {
  const { makeRequest, loading, error, LoadingComponent,showToast, ToastComponent } = useRequest();

    return { 
        listarAjusteStock: (ajuste:AjusteStockClass,showLoad = true) => makeRequest(listarAjusteStockGet, [ajuste], showLoad),
        registrarAjusteStockHooks: (ajuste:AjusteStockClass,showLoad = true) => makeRequest(registrarAjusteStockPost, [ajuste], showLoad),
        anularAjusteStockHooks: (ajuste:AjusteStockClass,showLoad = true) => makeRequest(anularAjusteStockPost, [ajuste], showLoad),
        loading, 
        error, 
        LoadingComponent, 
        showToast, 
        ToastComponent 
    };


}