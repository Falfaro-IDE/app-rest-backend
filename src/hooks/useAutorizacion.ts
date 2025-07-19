import values from "../models/clases/values";
import { validarOperacionService, validarPinService } from "../services/autorizacionService";
import { StorageService } from "../utils/storageService";
import { useRequest } from "./useRequest";
import { useState } from "react";

export const useAutorizacion = () => {
  const { makeRequest, loading, error, LoadingComponent, ToastComponent, showToast } = useRequest();

  const [showModal, setShowModal] = useState(false);
  const [accionPendiente, setAccionPendiente] = useState<() => void>(() => {});
  const [datosAutorizacion, setDatosAutorizacion] = useState<any>(null);
  const usuarioEmpresa = StorageService.getItem(values.storage.keySession);
  const [ requiereMotivo, setRequiereMotivo] = useState(false);

  const solicitarAutorizacion = async (config: {
    tipo_operacion: number,
    proceso: string,
    usuario_id?: number,
    perfil_id?: number,
    importe: number,
    transaccion_id: number,
    accion: () => void,
    norequiereaccion: () => void,
  }) => {
    const payload = {
      tipo_operacion: config.tipo_operacion,
      proceso: config.proceso,
      perfil_id: usuarioEmpresa ? usuarioEmpresa.objeto.idPerfil: 0,
      importe: config.importe,
    };
    console.log("empresa", usuarioEmpresa);
    const response = await makeRequest(validarOperacionService, [payload], true, false);
    if (response) {
        const { requiere_autorizacion, autorizacion_necesaria, requiere_motivo } = response.data.objeto;
        setRequiereMotivo(requiere_motivo);
        if (!autorizacion_necesaria) {
            // No requiere ningún tipo de autorización → ejecutar norequiereaccion
            config.norequiereaccion();
            return;
        }

       /*  if (!autorizacion_necesaria) {
        Requiere autorización pero no necesita PIN (por límite o regla) → ejecutar acción directa
        config.accion();
        return;
        } */

        // Si requiere autorización con PIN → abrir modal
        setDatosAutorizacion(config);
        setAccionPendiente(() => config.accion);
        setShowModal(true);
    }
  };

  const enviarPin = async (pinData: {
    autorizador: string,
    pin: string,
    motivo: string,
  }) => {
    const payload = {
      ...pinData,
      tipo_operacion: datosAutorizacion.tipo_operacion,
      proceso: datosAutorizacion.proceso,
      transaccion_id: datosAutorizacion.transaccion_id,
      solicitado_por: datosAutorizacion.usuario_id,
      importe: datosAutorizacion.importe,
      requiere_motivo:requiereMotivo
    };

    const res = await makeRequest(validarPinService, [payload], false, false);

    if (res.success) {
      if(res.data.objeto.validado){
        showToast(res.data.descripcion, 3000, 'success');
        accionPendiente();
        setShowModal(false);
      }else{
        showToast(res.data.descripcion, 3000, 'warning');
      }

    } else {
      showToast("Autorización fallida", 3000, 'danger');
    }
  };

  return {
    solicitarAutorizacion,
    enviarPin,
    showModal,
    setShowModal,
    loading,
    error,
    LoadingComponent,
    ToastComponent
  };
};