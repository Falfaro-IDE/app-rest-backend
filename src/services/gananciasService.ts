import axios from "axios";
import API_BASE_URL from "../config/apiConfig";
import { getAuthHeaders } from "../utils/authHeaders";
import { OBTENER_INSUMOS_GET } from "../models/clases/config";

export const obtenerGananciasGet = async (params: {
  producto_presentacion_id: number | null;
  fechaInicio: string;
  fechaFin: string;
}) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/obtenerGanacias`, {
      headers: getAuthHeaders(),
      params,
    });

    return data;
  } catch (error) {
    console.error("Error al obtener el stock del producto:", error);
    throw error;
  }
};


