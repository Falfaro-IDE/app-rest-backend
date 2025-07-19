import axios from "axios";
import API_BASE_URL from "../config/apiConfig";
import { getAuthHeaders } from "../utils/authHeaders";

export const obtenerUsuarioPerfilGet = async (perfil: number) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/obtenerUsuarioPerfil`, {
      params: { perfil },
      headers: getAuthHeaders(),
    });

    return data;
  } catch (error) {
    console.error("Error al obtener usuario por perfil:", error);
    throw error;
  }
};


