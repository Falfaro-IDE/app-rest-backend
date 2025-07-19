import axios from "axios";
import API_BASE_URL from "../config/apiConfig";
import { getAuthHeaders } from "../utils/authHeaders";
import { OBTENER_INSUMOS_GET } from "../models/clases/config";

export const obtenerAreaProduccionGet = async () => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/obtenerAreaProduccion`,{
      headers: getAuthHeaders()
  });
    return data;
  } catch (error) {
    console.error("Error al obtener texto:", error);
    throw error;
  }
};



