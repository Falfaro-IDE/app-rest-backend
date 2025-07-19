import axios from "axios";
import API_BASE_URL from "../config/apiConfig";
import { getAuthHeaders } from "../utils/authHeaders";

export const obtenerStockProductoGet = async (params: {
  producto_presentacion_id: number | null;
  insumo_id: number | null;
  fechaInicio: string;
  fechaFin: string;
}) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/obtenerStockProducto`, {
      headers: getAuthHeaders(),
      params,
    });

    return data;
  } catch (error) {
    console.error("Error al obtener el stock del producto:", error);
    throw error;
  }
};


