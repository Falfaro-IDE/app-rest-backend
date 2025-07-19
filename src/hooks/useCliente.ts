import { ClienteClass } from "../models/clases/Cliente";
import { editarClientePost, listarClienteGet, listarClientePorNombreGet, registrarClientePost } from "../services/clienteService";
import { useRequest } from "./useRequest";

export const useCliente = () => {
  const { makeRequest, loading, error, LoadingComponent,showToast, ToastComponent } = useRequest();

    return { 
        listarClienteHook: (showLoad = true, showToastMostrarExito = false) => makeRequest(listarClienteGet, [], showLoad, showToastMostrarExito),
        registrarClienteHook: (cliente:ClienteClass, showLoad = true) => makeRequest(registrarClientePost, [cliente], showLoad),
        editarClienteHook: (cliente:ClienteClass, showLoad = true) => makeRequest(editarClientePost, [cliente], showLoad),
        listarClientePorNombreHook: (texto:string, showLoad = true) => makeRequest(listarClientePorNombreGet, [texto], showLoad),
        error, 
        LoadingComponent, 
        showToast, 
        ToastComponent 
    };


}