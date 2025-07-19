import axios from "axios";
import { getAuthHeaders } from "../utils/authHeaders";
import API_BASE_URL from "../config/apiConfig";

export const actualizarPreparacionPost = async (Data: any) => {
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/actualizarPreparaciones`,
      Data,
      {
        headers: getAuthHeaders(),
      }
    );
    return data;
  } catch (error) {
    console.error("Error al actualizar preparacion:", error);
    throw error;
  }
};

export const obtenerPreparacionesGet = async (fecha: string) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/listarPreparaciones?fecha=${fecha}`, {
      headers: getAuthHeaders()
    });
    return data;
  } catch (error) {
    console.error("Error al obtener preparaciones:", error);
    throw error;
  }
};
