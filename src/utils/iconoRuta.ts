import { cardOutline,fastFoodOutline,desktopOutline, personOutline, cartOutline, bagHandleOutline, fileTrayFullOutline, folderOpenOutline, listOutline, cogOutline, statsChartOutline } from "ionicons/icons";

export const obtenerIcono = (ruta: string) => {
    switch (ruta) {
        case "/rest/punto_venta":
            return fastFoodOutline;
        case "/rest/caja":
            return desktopOutline;
        case "/rest/clientes":
            return personOutline;
        case "/rest/clientes":
            return personOutline;
        case "/rest/compras":
            return cartOutline;
        case "/rest/creditos":
            return cardOutline;
        case "/rest/inventario":
            return fileTrayFullOutline;
        case "/rest/contable":
            return folderOpenOutline;
        case "/rest/informes":
            return listOutline;
        case "/rest/ajustes":
            return cogOutline;
        case "/rest/tablero":
            return statsChartOutline;
        default:
        return bagHandleOutline;
    }
    };