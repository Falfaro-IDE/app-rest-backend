import { StorageService } from "./storageService";
import values from "../models/clases/values";

export const sessionesRutas = {
  loginSession: (router: any) => {
    const authSession = StorageService.getItem("authSession");
    if (!authSession) {
      router.push(values.rutas.rutas.login, "forward");
    }
  },

  restSession: (router: any) => {
    const authSession = StorageService.getItem("authSession");
    if (authSession) {
      router.push(values.rutas.rutas.homePrincipal.rutaPrincipal + values.rutas.rutas.homePrincipal.bienvenida, "forward");
    }
  },

  controlarPerfil: (lista: any, rutaActual: string) => {
    console.log("RUTA ACTUAL", rutaActual);
    return verificarAcceso(rutaActual, lista);
  },
};

const rutasExcepciones = values.rutas.rutasTodos;

const verificarAcceso = (ruta: any, lista: any) => {
    if (rutasExcepciones.includes(ruta)) {
      return true;
    }
  const rutasPermitidas = lista.flatMap((menu: any) => [menu.ruta, ...menu.subMenus.map((sub: any) => sub.ruta)]);
  return rutasPermitidas.some((rutaPermitida:any) => ruta.startsWith(rutaPermitida));
};