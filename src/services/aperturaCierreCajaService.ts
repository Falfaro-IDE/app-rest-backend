import axios from "axios";
import API_BASE_URL from "../config/apiConfig";
import { getAuthHeaders } from "../utils/authHeaders";

export const aperturarCajaPost = async (aperturaData: any) => {
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/aperturarCaja`,
      aperturaData,
      {
        headers: getAuthHeaders(),
      }
    );
    return data;
  } catch (error) {
    console.error("Error al aperturar caja:", error);
    throw error;
  }
};

export const obtenerMontosCajaGet = async (
  caja_apertura_cierre_id: number,
  soloMetodosPagos?: number
) => {
  try {
    const params: any = { caja_apertura_cierre_id };

    // Agregar soloMetodosPagos si está definido
    if (soloMetodosPagos !== undefined) {
      params.soloMetodosPagos = soloMetodosPagos;
    }

    const { data } = await axios.get(`${API_BASE_URL}/montosCierreCaja`, {
      params,
      headers: getAuthHeaders(),
    });

    return data;
  } catch (error) {
    console.error("Error al obtener cajas:", error);
    throw error;
  }
};

export const cerrarCajaPost = async (cierreData: any) => {
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/cerrarCaja`,
      cierreData,
      {
        headers: getAuthHeaders(),
      }
    );
    return data;
  } catch (error) {
    console.error("Error al cerrar caja:", error);
    throw error;
  }
};

export const validarAperturaUsuarioGet = async () => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/validarAperturaUsuario`, {
      headers: getAuthHeaders(),
    });
    return data;
  } catch (error) {
    console.error("Error al validar apertura de usuario:", error);
    throw error;
  }
};

export const arqueoCajaGet = async (apertura_cierre_caja_id: number) => {
  try {
    const params: any = { apertura_cierre_caja_id };
    console.log(params);
    
    const { data } = await axios.get(`${API_BASE_URL}/generarArqueoCaja`, {
      params,
      headers: getAuthHeaders()
    });
    return data;
  } catch (error) {
    console.error("Error al obtener arqueo de caja:", error);
    throw error;
  }
};

