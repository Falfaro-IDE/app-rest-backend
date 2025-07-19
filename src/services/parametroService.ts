import axios from "axios";
import API_BASE_URL from "../config/apiConfig";
import { ParametroClass } from "../models/clases/Parametro";
import { getAuthHeaders } from "../utils/authHeaders";

export const obtenerParametroPost = async (parametros: ParametroClass) => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/listarParametroPorPrefijo`,parametros,{
        headers: getAuthHeaders()
    });
    return data;
  } catch (error) {
    console.error("Error al obtener ajuste de stock:", error);
    throw error;
  }
};