import { useRequest } from "./useRequest";
import { obtenerUsuarioPerfilGet } from "../services/useUsuarioService";

export const useUsuario = () => {
  const { makeRequest, loading, error, LoadingComponent,showToast, ToastComponent } = useRequest();
  return { 
   
    obtenerUsuarioPerfil: (perfil: number) => makeRequest(() => obtenerUsuarioPerfilGet(perfil)),
    

    loading, 
    error, 
    LoadingComponent, 
    showToast, 
    ToastComponent 
  };
};