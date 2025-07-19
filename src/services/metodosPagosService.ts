import axios from "axios";
import API_BASE_URL from "../config/apiConfig";
import { getAuthHeaders } from "../utils/authHeaders";


export const obtenerMetodosPagosGet = async () => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/listarMetodosPagos`, {
      headers: getAuthHeaders(),
    });
    return data;
  } catch (error) {
    console.error("Error al obtener los metodos de pago:", error);
    throw error;
  }
};
