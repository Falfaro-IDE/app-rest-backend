import { IonPage, IonContent, IonRouterOutlet, IonButton, IonPopover, IonIcon, IonList, IonItem, IonLabel, IonSpinner, useIonRouter, IonHeader, IonToolbar, IonTitle, IonFooter} from '@ionic/react';
import './Home.css';
import Menu from '../../components/compartidos/Header';
import { Route, useLocation } from 'react-router';
import About from './About/About';
import MenuSidebarWeb from '../../components/compartidos/MenuSidebarWeb';
import { useEffect, useState } from 'react';
import { useSidebar } from '../../components/compartidos/SidebarContext';
import MenuSidebarMovilWeb from '../../components/compartidos/MenuSidebarMovilWeb';
import Venta from './Venta/Venta';
import { useAuth } from '../../hooks/useAuth';
import useIonLoading from '../../hooks/alertMessage/useIonLoading';
import Bienvenida from './Bienvenida/Bienvenida';
import { StorageService } from '../../utils/storageService';
import values from '../../models/clases/values';
import { sessionesRutas } from '../../utils/sessionesRutas';
import useToast from '../../hooks/alertMessage/useToast';
import ErrorConexion from '../../components/compartidos/ErrorConexion';
import AccesoPerfil from '../../components/compartidos/AccesoPerfil';
import Pedido from './Pedido/Pedido';
import AreaProduccion from './AreaProduccion/AreaProduccion';
import Productos from './Ajustes/Producto/ProductoAjuste';
import ajusteStock from './Inventario/AjusteStock/ajusteStock';
import Compra from './compra/compra';
import NuevaCompra from './compra/nuevaCompra';
import Stock from './Inventario/Reporte/inventario/stock';
import InformesInventario from './Inventario/Reporte/inventario/informesInvetario';
import StockMovimientoProducto from './Inventario/Reporte/inventario/stock_movimiento_producto';
import InformesVentas from './Inventario/Reporte/ventas/informesVentas';
import Ganancia from './Inventario/Reporte/ventas/ganacias';
import nuevoAjusteStock from './Inventario/AjusteStock/nuevoAjusteStock';
import Kardex from './Inventario/Kardex/Kardex';
import Cajas from './Ajustes/Caja/Cajas';
import AperturaCierreCaja from './Caja/aperturaCierre';
import PagoVenta from './PagoVenta/pagoVenta';
import Cliente from './Cliente/Cliente';
import Configuracion from './Ajustes/Configuracion/ConfiguracionInicial';


const Home: React.FC = () => {
  const { isExpanded } = useSidebar();
  const { handleGetMenu } = useAuth();
  const [ menu, setMenu] = useState<any>();
  const [ mostrarHome, setMostrarHome] = useState<any>(0);
  const { showLoading, hideLoading, LoadingComponent } = useIonLoading(); 
  const router = useIonRouter();
  const { showToast, ToastComponent } = useToast();
  const location = useLocation();
  const [tieneAcceso, settieneAcceso] = useState(false);

  useEffect(() => {
    sessionesRutas.loginSession(router);
    listarMenu();
  }, [])

  const listarMenu = async () => {
    const response = await handleGetMenu({perfil:1});
    if(response.success){
      setMenu(response.data.objeto);
      settieneAcceso(sessionesRutas.controlarPerfil(response.data.objeto, location.pathname));
      const storedSession = await StorageService.setItem(values.storage.menuSession, response.data.objeto);
      settieneAcceso(true);
      setMostrarHome(1);
    }else{
      setMostrarHome(2);
      showToast('Error de conexión.', 3000, "danger");
    }
  }
  
  return (
<>
  {ToastComponent}
  {mostrarHome === 0 ? (
    <div className="div-spinner">
      <IonSpinner name="crescent" class="icon-spinner"></IonSpinner>
    </div>
  ) : mostrarHome === 1 ? (
    tieneAcceso ? (
      <>
        <Menu menu={menu} />
        <div className="container">
          <div className={`sidebar ${isExpanded ? "expanded" : "collapsed"}`}>
            {isExpanded && menu ? (
              <MenuSidebarMovilWeb menu={menu} />
            ) : (
              <>
                {/* <MenuSidebarWeb menu={menu} /> */}
                <></>
              </>
            )}
          </div>

          <div className="main-content">
            <IonContent  scrollY={true} id='main-content'>
              <>
                <Route exact path={values.rutas.rutas.homePrincipal.rutaPrincipal + values.rutas.rutas.homePrincipal.bienvenida} component={Bienvenida} />
                <Route exact path={values.rutas.rutas.homePrincipal.rutaPrincipal + values.rutas.rutas.homePrincipal.venta} component={Venta} />
                <Route exact path={values.rutas.rutas.homePrincipal.rutaPrincipal + values.rutas.rutas.homePrincipal.pedido + "/:id/:idMesa"} component={Pedido} />
                <Route exact path={values.rutas.rutas.homePrincipal.rutaPrincipal + values.rutas.rutas.homePrincipal.produccion} component={AreaProduccion} />
                <Route exact path={values.rutas.rutas.homePrincipal.rutaPrincipal + values.rutas.rutas.homePrincipal.ajustes.productos} component={Productos} />
                <Route exact path={values.rutas.rutas.homePrincipal.rutaPrincipal + values.rutas.rutas.homePrincipal.ajuste_stock.lista} component={ajusteStock} />
                <Route exact path={values.rutas.rutas.homePrincipal.rutaPrincipal + values.rutas.rutas.homePrincipal.ajuste_stock.nuevo} component={nuevoAjusteStock} />
                <Route exact path={values.rutas.rutas.homePrincipal.rutaPrincipal + values.rutas.rutas.homePrincipal.compra.listadocompra} component={Compra} />
                <Route exact path={values.rutas.rutas.homePrincipal.rutaPrincipal + values.rutas.rutas.homePrincipal.compra.nuevacompra} component={NuevaCompra} />
                <Route exact path={values.rutas.rutas.homePrincipal.rutaPrincipal + values.rutas.rutas.homePrincipal.inventario.stock} component={Stock} />
                <Route exact path={values.rutas.rutas.homePrincipal.rutaPrincipal + values.rutas.rutas.homePrincipal.informes.inventario} component={InformesInventario} />
                <Route exact path={values.rutas.rutas.homePrincipal.rutaPrincipal + values.rutas.rutas.homePrincipal.informes.stock_movimiento_producto} component={StockMovimientoProducto} />
                <Route exact path={values.rutas.rutas.homePrincipal.rutaPrincipal + values.rutas.rutas.homePrincipal.informes.ventas} component={InformesVentas} />
                <Route exact path={values.rutas.rutas.homePrincipal.rutaPrincipal + values.rutas.rutas.homePrincipal.informes.margen_de_ganacia} component={Ganancia} />
                <Route exact path={values.rutas.rutas.homePrincipal.rutaPrincipal + values.rutas.rutas.homePrincipal.informes.inventario_kardex} component={Kardex} />
                <Route exact path={values.rutas.rutas.homePrincipal.rutaPrincipal + values.rutas.rutas.homePrincipal.ajustes.cajas} component={Cajas} />
                <Route exact path={values.rutas.rutas.homePrincipal.rutaPrincipal + values.rutas.rutas.homePrincipal.caja.aperturaCierreCaja} component={AperturaCierreCaja} />
                <Route exact path={values.rutas.rutas.homePrincipal.rutaPrincipal + values.rutas.rutas.homePrincipal.pagoVenta} component={PagoVenta} />
                <Route exact path={values.rutas.rutas.homePrincipal.rutaPrincipal + values.rutas.rutas.homePrincipal.clientes.lista} component={Cliente} />
                <Route exact path={values.rutas.rutas.homePrincipal.rutaPrincipal + values.rutas.rutas.homePrincipal.ajustes.configuracion} component={Configuracion} />
              </>
            </IonContent>

          </div>
        </div>
      </>
    ) : (
      <AccesoPerfil />
    )
  ) : (
    <ErrorConexion />
  )}
</>
  );
};

export default Home;