import { login, getMenu, logout, sendEmail, sendPassword, listarUsuarioPersona } from "../services/authServices";
import { useRequest } from "./useRequest";

export const useAuth = () => {
  const { makeRequest, loading, error, LoadingComponent,showToast, ToastComponent } = useRequest();

  return { 
    handleLogin         : (username: string, password: string) => makeRequest(login, [username, password]),
    handleGetMenu       : (perfil:any) => makeRequest(getMenu, [perfil]), 
    handleLogout        : (id:any) => makeRequest(logout,[id]),
    handleCorreo        : (datos:any) => makeRequest(sendEmail,[datos]),
    handlePassword      : (datos:any) => makeRequest(sendPassword,[datos]),
    listarUsuarioPersona: (showLoad = true) => makeRequest(listarUsuarioPersona, [], showLoad),
    loading, 
    error, 
    LoadingComponent, 
    showToast, 
    ToastComponent 
  };
};