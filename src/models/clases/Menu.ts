interface SubMenu {
    id: number;
    descripcion: string;
    ruta: string | null;
    opciones: any[];
  }
  
  interface MenuItem {
    id: number;
    perfil: number;
    descripcion: string;
    ruta: string | null;
    subMenus: SubMenu[];
  }

interface MenuSidebarProps {
    menu: MenuItem[];
  }