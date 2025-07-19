import { useState } from "react";
import useIonLoading from "./alertMessage/useIonLoading";
import useToast from "./alertMessage/useToast";
import values from "../models/clases/values";
import { StorageService } from "../utils/storageService";
import { useIonRouter } from "@ionic/react";

export const useRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showLoading, hideLoading, LoadingComponent } = useIonLoading();
  const { showToast, ToastComponent } = useToast();
  const router = useIonRouter();

  const makeRequest = async (apiFunction: Function, params: any[] = [], showLoad: boolean= true, showToastMostrarExito: boolean = true,showToastMostrarError: boolean = true) => {
    setError(null);
    if (showLoad) showLoading("Cargando...");

    try {
      const data = await apiFunction(...params);

      if (data?.codigo === 1) {
        if (showToastMostrarExito) showToast(data.descripcion, 5000, "success");
        return { success: true, data };
      } else {
        setError(data.descripcion);
        if (showToastMostrarError) showToast(data.descripcion, 5000, "warning");
        return { success: false, descripcion: data.descripcion, data: null };
      }
    } catch (err: any) {
      if(err.response && err.response.data && err.response.data.codigo == 401) {
        StorageService.clear();
        router.push(values.rutas.rutas.login, "forward");
      }
      if (err.response) {
        setError(err.response.data.descripcion);
        showToast(err.response.data.descripcion, 3000, "danger");
      } else {
        setError(values.message.cathError);
        showToast(values.message.cathError, 3000, "danger");
      }
      return { success: false, data: null };
    } finally {
      if (showLoad) hideLoading();
    }
  };

  return { makeRequest, loading, error, LoadingComponent,showToast, ToastComponent };
};