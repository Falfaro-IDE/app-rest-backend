import axios from "axios";
import API_BASE_URL from "../config/apiConfig";
import { StorageService } from "../utils/storageService";
import values from "../models/clases/values";
import { getAuthHeaders } from "../utils/authHeaders";
export const login = async (username: string, password: string) => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/login`, {
      "usuario":username,
      "subdominio": values.rutas.subnodmino,
      "password":password
  });

    return data;
  } catch (error) {
    console.error("Error en la autenticación:", error);
    throw error;
  }
};

export const getMenu = async (perfil:any) => {
  const perfilStorage = StorageService.getItem(values.storage.keySession);
  console.log("perfil", perfilStorage.objeto.idPerfil)
  try {

    const { data } = await axios.post(
      `${API_BASE_URL}/obtenerAccesos`, 
      {"perfil": perfilStorage.objeto.idPerfil},
      { headers: getAuthHeaders() }
    );

    return data;
  } catch (error) {
    console.error("Error obteniendo el menú:", error);
    throw error;
  }
};

export const logout = async (id:any) => {
  try {
    await axios.post(`${API_BASE_URL}/logOut`,{
      "id": id
    });
    return { codigo: 1, mensaje: "Sesión cerrada con éxito" };
  } catch (error) {
    console.error("Error cerrando sesión:", error);
    throw error;
  }
};

export const sendEmail = async (email:any) => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/enviarEmailRecuperacion`,{
      "email": email,
      "subDominio": values.rutas.subnodmino
    });
    return data;
  } catch (error) {
    console.error("Error cerrando sesión:", error);
    throw error;
  }
};

export const sendPassword = async (password:any) => {
  try {

    const { data } = await axios.post(
      `${API_BASE_URL}/actualizarUsuario`, 
      {password: password.password1,"subDominio": values.rutas.subnodmino},
      {
        headers: {
          Authorization: `Bearer ${password.token}`,
          "Content-Type": "application/json"
        }
      }
    );

    return data;
  } catch (error) {
    console.error("Error obteniendo el menú:", error);
    throw error;
  }
};

export const listarUsuarioPersona = async () => {
  try {

    const { data } = await axios.get(
      `${API_BASE_URL}/obtenerUsuariosConPersonaPorEmpresa`,
      { headers: getAuthHeaders() }
    );

    return data;
  } catch (error) {
    console.error("Error obteniendo persona:", error);
    throw error;
  }
};