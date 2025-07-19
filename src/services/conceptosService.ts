import axios from "axios";
import API_BASE_URL from "../config/apiConfig";
import { getAuthHeaders } from "../utils/authHeaders";
import { OBTENER_CONCEPTOCOMPROBANTE_GET, OBTENER_PAGOCOMPRA_GET } from "../models/clases/config";

export const obtenerConceptosComprobantesGet = async (params: any) => {
  try {
    const queryParams: any = {};

    // // Verificar si hay categoría
    if (params?.[OBTENER_CONCEPTOCOMPROBANTE_GET.con_prefijo]) {
      queryParams[OBTENER_CONCEPTOCOMPROBANTE_GET.con_prefijo] =
        params[OBTENER_CONCEPTOCOMPROBANTE_GET.con_prefijo];
    }

    const { data } = await axios.post(
      `${API_BASE_URL}/conceptosall`,
      queryParams, // Esto es el body del POST
      {
        headers: getAuthHeaders(),
      }
    );

    return data;
  } catch (error) {
    console.error("Error al obtener insumos:", error);
    throw error;
  }
};

export const obtenerConceptosPagoCompraGet = async (params: any) => {
  try {
    const queryParams: any = {};

    // // Verificar si hay categoría
    if (params?.[OBTENER_PAGOCOMPRA_GET.con_prefijo]) {
      queryParams[OBTENER_PAGOCOMPRA_GET.con_prefijo] =
        params[OBTENER_PAGOCOMPRA_GET.con_prefijo];
    }

    const { data } = await axios.post(
      `${API_BASE_URL}/conceptosall`,
      queryParams, // Esto es el body del POST
      {
        headers: getAuthHeaders(),
      }
    );

    return data;
  } catch (error) {
    console.error("Error al obtener insumos:", error);
    throw error;
  }
};

