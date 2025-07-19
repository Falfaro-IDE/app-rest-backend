import { EmpresaClass } from "../models/clases/Empresa";
import { actualizarCodigoPost } from "../services/empresaService";
import { useRequest } from "./useRequest";

export const useEmpresa = () => {
  const { makeRequest, loading, error, LoadingComponent,showToast, ToastComponent } = useRequest();

    return { 
        actualizarCodigoHook: (empresa:EmpresaClass, showLoad = true, showToastMostrarExito = false) => makeRequest(actualizarCodigoPost, [empresa], showLoad, showToastMostrarExito),
        error, 
        LoadingComponent, 
        showToast, 
        ToastComponent 
    };


}