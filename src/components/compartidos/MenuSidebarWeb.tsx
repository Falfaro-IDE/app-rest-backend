import React, { useRef, useState } from "react";
import { IonItem, IonInput, IonButton, IonIcon, IonPopover, IonContent, IonList, IonAccordionGroup, IonAccordion, IonLabel } from "@ionic/react";
import { cardOutline,storefrontOutline, peopleOutline } from 'ionicons/icons';
import './MenuSidebarWeb.css'
import { useHistory, useLocation } from "react-router-dom";
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
    { "id": 1, "perfil": 1, "descripcion": "Punto de Venta", "ruta": "/api/venta", "subMenus": [] },
    { "id": 2, "perfil": 1, "descripcion": "Caja", "ruta": "/api/caja", "subMenus": [
        { "id": 2, "descripcion": "Apertura y Cierre", "ruta": "/api/caja/apertura_cierre", "opciones": [] },
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

const MenuSidebarWeb: React.FC<MenuSidebarProps> = ({ menu }) => {

    const history = useHistory();
    const location = useLocation();
    
    const handleNavigation = (ruta: any) => {
        if (ruta) {
            history.push(ruta.startsWith("/") ? ruta : `/${ruta}`);
        }
    };


    return (
        <div className="div-menu-sidebar-web">
               {
                menu && menu.length > 0 ? (
                    <ul className="menu-list">
                    {menu.map(menu => {
                        const hasSubMenus = menu.subMenus.length > 0;
                        const isActiveMenu = (menu.ruta ? location.pathname.startsWith(menu.ruta) : false)
                        const iconoIcons = obtenerIcono(menu.ruta!)
                        || menu.subMenus.some(sub => location.pathname === sub.ruta);
        
                        return (
                            <li key={menu.id} className="menu-item">
                                <div className="menu-icon-container">
                                    <IonIcon 
                                        icon={`${iconoIcons}`}
                                        className={`${isActiveMenu ? "active-item-web" : ""} item-icon-menu-web`}
                                        onClick={() => handleNavigation(menu.ruta)}
                                    />
                                </div>
        
                                <div className="menu-tooltip">
                                    <span onClick={() => handleNavigation(menu.ruta)} className={`${isActiveMenu ? "active-span-item-web" : "span-item-web"}`}>{menu.descripcion}</span>
        
                                    {hasSubMenus && (
                                        <ul className="submenu">
                                            {menu.subMenus.map(sub => {
                                                const isActiveSubMenu = location.pathname === sub.ruta;
                                                return (
                                                    <li 
                                                        key={sub.id} 
                                                        className={`${isActiveSubMenu ? "active-item-submenu-web" : "item-submenu-web"}`}
                                                        onClick={() => handleNavigation(sub.ruta)}
                                                    >
                                                        {sub.descripcion}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>
                ):
                <></>
            }
            
 
        </div>
    );
};

export default MenuSidebarWeb;