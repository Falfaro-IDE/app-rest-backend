import axios from "axios";
import API_BASE_URL from "../config/apiConfig";
import { getAuthHeaders } from "../utils/authHeaders";
import { ClienteClass } from "../models/clases/Cliente";

export const listarClienteGet = async () => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/listarCliente`,{
        headers: getAuthHeaders()
    });
    return data;
  } catch (error) {
    console.error("Error al obtener lista de cliente", error);
    throw error;
  }
};

export const registrarClientePost = async (cliente:ClienteClass) => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/registrarCliente`,cliente,{
        headers: getAuthHeaders()
    });
    return data;
  } catch (error) {
    console.error("Error al registrar cliente:", error);
    throw error;
  }
};

export const editarClientePost = async (cliente:ClienteClass) => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/actualizarCliente`,cliente,{
        headers: getAuthHeaders()
    });
    return data;
  } catch (error) {
    console.error("Error al actualizar cliente:", error);
    throw error;
  }
};

export const listarClientePorNombreGet = async (texto:string) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/listarClientePorNombre?texto=${texto}`,{
        headers: getAuthHeaders()
    });
    return data;
  } catch (error) {
    console.error("Error al obtener lista de cliente", error);
    throw error;
  }
};