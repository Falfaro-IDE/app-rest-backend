import React, { useState } from "react";
import { IonPage, IonContent, IonButton } from "@ionic/react";
import { useHistory } from "react-router-dom";
import './Pedido.css'
import Producto from "./Producto/Producto";
import DetallePedido from "./DetallePedido/DetallePedido";
import useToast from "../../../hooks/alertMessage/useToast";

const Pedido: React.FC = () => {
  const [productosSeleccionados, setProductosSeleccionados] = useState<any[]>([]);
  const history = useHistory();
  const { ToastComponent,showToast } = useToast();

  const agregarProductoSeleccionado = (producto: any) => {
    if(producto.control_stock == 0 && producto.stock <= 0 && producto.cortesia == 1){
      showToast("No se puede seleccionar este producto sin stock", 3000, "warning");
    }else{
    setProductosSeleccionados((prev:any) => [producto]);
    }
  };

  return (
    <div >
      <div className="div-pedido">
        {ToastComponent}
        <div className="div-producto">
            <Producto onProductoClick={agregarProductoSeleccionado}></Producto>
        </div>
        <div className="div-detalle-pedido">
            <DetallePedido detalle={productosSeleccionados}></DetallePedido>
        </div>
      </div>
    </div>
  );
};

export default Pedido;