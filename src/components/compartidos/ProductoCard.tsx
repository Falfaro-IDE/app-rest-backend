import React from "react";
import { IonBadge } from "@ionic/react";
import './ProductoCard.css';
import imgNoDisponible from "../../assets/img/img-producto-no-disponible.jpg"
import values from "../../models/clases/values";

interface ProductoProps {
    prod: any;
    onClick: (producto: any) => void;
}

const ProductoCard: React.FC<ProductoProps> = ({ prod, onClick }) => {
    return (
        <div className="producto fadeInDown" onClick={() => onClick(prod)}>
            <div className="div-unidad-precio">
                <div className="div-unidad">
                    {
                        prod.control_stock == 0 && (
                            <IonBadge slot="start" class="label-unidad">{prod.stock} Und</IonBadge>
                        )
                    }
                </div>
                <div className="div-precio">
                    <IonBadge slot="start" class="label-precio">S/ {Number(prod.precio).toFixed(values.numeros.decimales)}</IonBadge>
                </div>
            </div>
            <img src={imgNoDisponible} alt="" />
            <div className="nombre-producto">
                {prod.descripcion}
            </div>
        </div>
    );
};

export default ProductoCard;