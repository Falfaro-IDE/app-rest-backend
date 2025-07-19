import { ParametroClass } from "../models/clases/Parametro";
import { obtenerParametroPost } from "../services/parametroService";
import { useRequest } from "./useRequest";

export const useParametro = () => {
  const { makeRequest, loading, error, LoadingComponent,showToast, ToastComponent } = useRequest();

    return { 
        obtenerParametroHooks: (parametro:ParametroClass,showLoad = true) => makeRequest(obtenerParametroPost, [parametro], showLoad),
        loading, 
        error, 
        LoadingComponent, 
        showToast, 
        ToastComponent 
    };


}