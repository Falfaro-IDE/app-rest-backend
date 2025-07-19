import React from "react";
import { IonItem, IonInput, IonButton, IonIcon, IonPopover, IonContent, IonList, IonAccordionGroup, IonAccordion, IonLabel, IonMenuToggle} from "@ionic/react";
import { cardOutline,storefrontOutline, peopleOutline } from 'ionicons/icons';
import './MenuSidebarMovilWeb.css'
import { useHistory, useLocation } from "react-router-dom";
import { menuController } from "@ionic/core";
import { obtenerIcono } from "../../utils/iconoRuta";

interface MenuSidebarWebProps {
  label: string;
  type?: "text" | "password" | "email" | "number";
  value?: string;
  onIonChange?: (e: CustomEvent) => void;
  onClick?: () => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  color?: string;
}

const menuData = [
    { "id": 1, "perfil": 1, "descripcion": "Punto de Venta", "ruta": "/rest/venta", "subMenus": [] },
    { "id": 2, "perfil": 1, "descripcion": "Caja", "ruta": "/rest/caja", "subMenus": [
        { "id": 2, "descripcion": "Apertura y Cierre", "ruta": "/rest/caja/apertura_cierre", "opciones": [] },
        { "id": 3, "descripcion": "Ingresos", "ruta": "/api/caja/ingresos", "opciones": []},
        { "id": 4, "descripcion": "Egresos", "ruta": "/api/caja/egresos", "opciones": [] },
        { "id": 5, "descripcion": "Monitor de Ventas", "ruta": "/api/caja/monitor_ventas", "opciones": [] }
    ]},
    { "id": 3, "perfil": 1, "descripcion": "Clientes", "ruta": "/api/about", "subMenus": [] },
    { "id": 4, "perfil": 1, "descripcion": "Compras", "ruta": null, "subMenus": [] },
    { "id": 5, "perfil": 1, "descripcion": "Creditos", "ruta": null, "subMenus": [] },
    { "id": 6, "perfil": 1, "descripcion": "Inventario", "ruta": null, "subMenus": [] },
    { "id": 7, "perfil": 1, "descripcion": "Contable", "ruta": null,  "subMenus": []},
    { "id": 8, "perfil": 1, "descripcion": "Informe", "ruta": null, "subMenus": [] },
    { "id": 9, "perfil": 1, "descripcion": "Tablero", "ruta": null, "subMenus": [] },
    { "id": 10, "perfil": 1, "descripcion": "Ajustes", "ruta": null, "subMenus": [] }
];

  const MenuSidebarMovilWeb: React.FC<MenuSidebarProps> = ({ menu }) => {

    const history = useHistory();
    const location = useLocation();
    const handleNavigation = async (ruta: any) => {
        if (ruta) {
            history.push(ruta.startsWith("/") ? ruta : `/${ruta}`);
            await menuController.close("mainMenu");
        }
    };
    
  return (
      <IonContent>
        {
            menu && menu.length > 0 ? (
            <IonList>
                <IonAccordionGroup>
                {menu.map(menu => {
                    const isActiveMenu = (menu.ruta ? location.pathname.startsWith(menu.ruta) : false) 
                    const iconoIcons = obtenerIcono(menu.ruta!)
                    || menu.subMenus.some(sub => location.pathname === sub.ruta);
                    return menu.subMenus.length > 0 ? (
                        <IonAccordion value={menu.id.toString()} key={menu.id} className={isActiveMenu ? "active-accordion" : ""}>
                            <IonItem slot="header" className={isActiveMenu ? "active-item" : ""}>
                                <IonIcon 
                                    icon={`${iconoIcons}`}
                                    className={`${isActiveMenu ? "active-item" : ""} item-icon`} 
                                />
                                <IonLabel>{menu.descripcion}</IonLabel>
                            </IonItem>
                            <div className="ion-padding" slot="content">
                                {menu.subMenus.map(sub => {
                                    const isActiveSubMenu = location.pathname === sub.ruta;
                                    return (
                                        <div key={sub.id}>
                                            <IonMenuToggle class="menu-toggle-movil"  >
                                                <IonItem 
                                                   
                                                    button 
                                                    onClick={() => handleNavigation(sub.ruta)}
                                                    className={isActiveSubMenu ? "active-item-submenu" : ""}
                                                >
                                                    <IonLabel>{sub.descripcion}</IonLabel>
                                                </IonItem>
                                            </IonMenuToggle>

                                            <IonItem 
                                                    
                                                    button 
                                                    onClick={() => handleNavigation(sub.ruta)}
                                                    className={`menu-toggle-web ${isActiveSubMenu ? "active-item-submenu" : ""}`}
                                                >
                                                    <IonLabel>{sub.descripcion}</IonLabel>
                                                </IonItem>
                                        </div>
                                    );
                                })}
                            </div>
                        </IonAccordion>
                    ) : (
                        <div key={menu.id} >
                            <IonMenuToggle class="menu-toggle-movil" >
                                <IonItem 
                                    
                                    button 
                                    onClick={() => handleNavigation(menu.ruta)}
                                    className={isActiveMenu ? "active-item" : ""}
                                >
                                    <IonIcon icon={`${iconoIcons}`} className={` ${isActiveMenu ? "active-item" : ""} item-icon`}></IonIcon>
                                    <IonLabel>{menu.descripcion}</IonLabel>
                                </IonItem>
                            </IonMenuToggle>
                            
                            <IonItem 
                                
                                button 
                                onClick={() => handleNavigation(menu.ruta)}
                                className={`menu-toggle-web ${isActiveMenu ? "active-item" : ""}`}
                            >
                                <IonIcon icon={`${iconoIcons}`} className={`menu-toggle-web  ${isActiveMenu ? "active-item" : ""} item-icon`}></IonIcon>
                                <IonLabel>{menu.descripcion}</IonLabel>
                            </IonItem>
                        </div>

                    

                    );
                })}
                </IonAccordionGroup>
            </IonList>
            ):
            <></>
        }

      </IonContent>
  );
};

export default MenuSidebarMovilWeb;