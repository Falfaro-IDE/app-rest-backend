import axios from "axios";
import API_BASE_URL from "../config/apiConfig";
import { getAuthHeaders } from "../utils/authHeaders";
import { KardexClass } from "../models/clases/Kardex";

export const listarKardexGet = async (kardex:KardexClass) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/listaInvetarioKardex?fechaInicio=${kardex.fechaInicio}&fechaFin=${kardex.fechaFin}&presentacionId=${kardex.presentacionId}&insumoId=${kardex.insumoId}`,{
        headers: getAuthHeaders()
    });
    return data;
  } catch (error) {
    console.error("Error al obtener ajuste de stock:", error);
    throw error;
  }
};