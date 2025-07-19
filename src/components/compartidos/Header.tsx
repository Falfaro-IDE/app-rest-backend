import React, {ReactNode, useEffect, useState} from "react";
import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButtons, IonMenuButton, IonButton, IonIcon, useIonRouter, IonMenuToggle } from "@ionic/react";
import { Link } from "react-router-dom";
import { useSidebar } from "./SidebarContext";
import { exitOutline,menuOutline, peopleOutline } from 'ionicons/icons';
import './Header.css'
import MenuSidebarMovilWeb from "./MenuSidebarMovilWeb";
import { useAuth } from "../../hooks/useAuth";
import { StorageService } from "../../utils/storageService";
import values from "../../models/clases/values";

interface MenuProps {
    children: ReactNode;
  }

const Header: React.FC<MenuSidebarProps> = ({ menu }) => {
  const { toggleSidebar, isExpanded } = useSidebar();
  const router = useIonRouter();
  const { handleLogout,LoadingComponent } = useAuth();
  const usuario = StorageService.getItem(values.storage.keySession);
  const menuRef = React.useRef<HTMLIonMenuElement>(null);
  const [user, setUser] = useState<any>(null);

  const salirSesion = async () => {
    const response = await handleLogout(usuario.objeto.idUsuario);
    StorageService.clear();
    router.push(values.rutas.rutas.login, "forward");
  }

  useEffect(() => {
    let user = StorageService.getItem(values.storage.keySession);
    if (user) {
      setUser(user)
    }
  }, [])

  return (
    <>
    {LoadingComponent}
      {/* 🚀 Menú Lateral */}
      <IonMenu contentId="main-content" id="mainMenu" swipeGesture={false} >
        <IonHeader>
          <IonToolbar className="color-primary-app">
            <IonTitle></IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
        <MenuSidebarMovilWeb menu={menu}></MenuSidebarMovilWeb>
        </IonContent>
      </IonMenu>

      {/* 🚀 Contenido Principal */}
        <IonHeader>
          <IonToolbar className="color-primary-app color-letters-white">
            <IonButtons slot="start">
              <IonMenuButton className="size-button-movil" mode="md" />
              <IonButton onClick={toggleSidebar} color={'light'} className="size-button" ><IonIcon icon={menuOutline}></IonIcon></IonButton>
            </IonButtons>
            <IonButtons slot="end" onClick={salirSesion} >
              <IonIcon 
                  icon={exitOutline}
                  className="icono-salir-header"
              />
            </IonButtons>
            {
              user && (
                <IonTitle>Bienvenido: {user.objeto.nombre}</IonTitle>
              )
            }
          </IonToolbar>
        </IonHeader>
      
    </>
  );
};

export default Header;