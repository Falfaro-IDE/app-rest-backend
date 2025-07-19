import React, { useEffect, useState } from "react";
import { IonPage, IonContent, IonButton, IonBadge, IonLabel, IonSearchbar } from "@ionic/react";
import { useHistory } from "react-router-dom";
import './Producto.css';
import { useVenta } from "../../../../hooks/useVenta";
import { CATEGORIAS, OBTENER_PRESENTACIONES_GET, PRESENTACIONES } from "../../../../models/clases/config";
import useToast from "../../../../hooks/alertMessage/useToast";
import ProductoCard from "../../../../components/compartidos/ProductoCard";
import CategoriaCard from "../../../../components/compartidos/CategoriaCard";
import { ProductoClass } from "../../../../models/clases/Producto";
import { useSocketEvent } from "../../../../hooks/useSocketEvent";
import { SOCKET_EVENTS } from "../../../../models/clases/socketEvents";

interface ProductoProps {
  onProductoClick: (producto: ProductoClass) => void;
}

const Producto: React.FC<ProductoProps> = ({ onProductoClick }) => {
  const history = useHistory();
  const { obtenerPresentaciones, obtenerPresentacionesTexto, obtenerCategorias, LoadingComponent } = useVenta();
  const [ productos, setProductos] = useState<ProductoClass[]>([]);
  const { showToast, ToastComponent } = useToast();
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [ categorias, setCategorias] = useState<any>([]);
  const [ categoriaActiva, setCategoriaActiva] = useState(null);
  const [ productosClass, setProductosClass] = useState<ProductoClass[]>([]);

  useEffect(() => {
    obtenerCategoriasLista();
  }, []);

  const obtenerCategoriasLista = async() => {
    const response:any = await obtenerCategorias();
    if(response.success ){
        if(response.data.objeto.length > 0){
            let datos = categoriasObjecto(response.data.objeto);
            setCategoriaActiva(datos.categorias[0]["id"]);
            obtenerPresentacionesLista(datos.categorias[0]["id"]);
            setCategorias(datos.categorias);
        }else{ 
            setCategorias([]);
            showToast("No se encontraron categorías", 3000, "warning");
        }
    }
  }

  const obtenerPresentacionesLista = async (categoria:any) => {
    const response:any = await obtenerPresentaciones({[OBTENER_PRESENTACIONES_GET.categoria_id]: categoria});
    
    if(response.success ){
        if(response.data.objeto.length > 0){
            let datos = productosObjecto(response.data.objeto)
              setProductos(datos);
        }else{ 
            setProductos([]);
            showToast("No se encontraron productos", 3000, "warning");
        }
    }
  }

  let currentRequestId = 0;
  const buscar = (e: any) => {
    const valor = e.target.value.trim();
    if (timer) clearTimeout(timer);
    setProductos([]);
    if (valor.length === 0) {
      obtenerPresentacionesLista(categoriaActiva);
      return;
    }
    const nuevoTimer = setTimeout(async () => {
      const requestId = ++currentRequestId;
      const response: any = await obtenerPresentacionesTexto({
        [OBTENER_PRESENTACIONES_GET.texto]: valor
      });
      if (requestId === currentRequestId) {
        if (response.success && response.data.objeto.length > 0) {
          const datos = productosObjecto(response.data.objeto);
          setProductos(datos);
        } else {
          setProductos([]);
        }
      }
    }, 500);

    setTimer(nuevoTimer);
  };


  const productosObjecto = (productosC: any) => {
    const datosMapeados: ProductoClass[] = productosC?.map((prod: any) => {
      const producto = new ProductoClass();
      producto.producto_id              = prod[PRESENTACIONES.idProducto];
      producto.producto_presentacion_id = prod[PRESENTACIONES.idPresentacion];
      producto.precio                   = prod[PRESENTACIONES.costo];
      producto.precioOriginal           = prod[PRESENTACIONES.costo];
      producto.comentario               = prod[PRESENTACIONES.notas] || '';
      producto.cantidad                 = 1;
      producto.fecha_creacion           = new Date().toISOString().split('T')[0];
      producto.hora_creacion            = new Date().toTimeString().split(' ')[0];
      producto.fecha_pedido             = new Date().toISOString().split('T')[0];
      producto.hora_pedido              = new Date().toTimeString().split(' ')[0];
      producto.stock                    = prod[PRESENTACIONES.stock];
      producto.img                      = prod[PRESENTACIONES.img];
      producto.criterio_stock           = prod[PRESENTACIONES.criterio_stock];
      producto.descripcion              = prod[PRESENTACIONES.descripcion];
      producto.codigoPresentacion       = prod[PRESENTACIONES.codigoPresentacion];
      producto.cortesia       = prod[PRESENTACIONES.cortesia];
      producto.selectCortesia       = false;
      producto.control_stock           = prod[PRESENTACIONES.control_stock];
      return producto;
    }) || [];
    return datosMapeados;
  };

  const categoriasObjecto = (categoriaC:any) => {
    const datosMapeados = {
        categorias: categoriaC?.map((cat: any) => ({
            empresa_id          : cat[CATEGORIAS.empresa_id],
            fecha_creacion      : cat[CATEGORIAS.fecha_creacion],
            hora_creacion       : cat[CATEGORIAS.hora_creacion],
            id                  : cat[CATEGORIAS.id],
            imagen              : cat[CATEGORIAS.imagen],
            marca_baja          : cat[CATEGORIAS.marca_baja],
            nombre              : cat[CATEGORIAS.nombre],
            tipo              : cat[CATEGORIAS.tipo],
        })) || [],
      }
    return datosMapeados;
  }

  const handleProductoClick = (producto: ProductoClass) => {
    onProductoClick(producto);
  };

  const handleCategoriaClick = (cat:any) => {
      setCategoriaActiva(cat.id);
      setProductos([]);
      obtenerPresentacionesLista(cat.id);
  };

  useSocketEvent(SOCKET_EVENTS.PEDIDO_ACTUALIZADO_MESA, (data) => {
    obtenerPresentacionesLista(categoriaActiva);
  });

  return (
    <div className="div-container">
    {ToastComponent}
      <div className="ion-padding">
        <div>
            <IonSearchbar placeholder="Buscar" mode="ios" className="buscador" onIonInput={(e) => buscar(e)}></IonSearchbar>
        </div>
        <div className="categoria-grid">
            {categorias.filter((cat: any) => cat.tipo === 1).map((cat:any) => (
                <CategoriaCard key={cat.id} cat={cat} isActive={categoriaActiva === cat.id} onClick={handleCategoriaClick} />
            ))}
        </div>
        <div className="separador">
            
        </div>
        <div className="div-productos-grid-principal">
        <div className="producto-grid scroll-horizontal-productos">
            {productos.map((prod:ProductoClass) => (
              <ProductoCard key={prod.producto_presentacion_id} prod={prod} onClick={handleProductoClick} />                                          
            ))}
        </div>
        </div>
      </div>
    </div>
  );
};

export default Producto;