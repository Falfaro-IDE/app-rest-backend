import axios from "axios";
import API_BASE_URL from "../config/apiConfig";
import { getAuthHeaders } from "../utils/authHeaders";


export const RegistrarVentaPost = async (venta: any) => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/registrarVenta`, venta, {
      headers: getAuthHeaders(),
    });
    return data;
  } catch (error) {
    console.error("Error al registrar la venta:", error);
    throw error;
  }
};
