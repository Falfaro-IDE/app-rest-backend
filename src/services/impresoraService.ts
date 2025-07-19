import axios from "axios";
import API_BASE_URL from "../config/apiConfig";
import { getAuthHeaders } from "../utils/authHeaders";

export const obtenerImpresorasGet = async () => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/listarImpresoras`, {
      headers: getAuthHeaders(),
    });
    return data;
  } catch (error) {
    console.error("Error al obtener impresoras:", error);
    throw error;
  }
};


