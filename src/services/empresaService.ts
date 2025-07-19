import axios from "axios";
import API_BASE_URL from "../config/apiConfig";
import { EmpresaClass } from "../models/clases/Empresa";
import { getAuthHeaders } from "../utils/authHeaders";

export const actualizarCodigoPost = async (empresa:EmpresaClass) => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/actualizarCodigo`,empresa,{
        headers: getAuthHeaders()
    });
    return data;
  } catch (error) {
    console.error("Error al registrar cliente:", error);
    throw error;
  }
};