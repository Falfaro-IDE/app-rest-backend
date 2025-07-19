import {
  IonSearchbar,
  IonList,
  IonItem,
  IonLabel,
  IonSpinner,
} from "@ionic/react";
import React, { useState, useRef, useEffect } from "react";
import "./BuscadorCliente.css";
import { useCliente } from "../../hooks/useCliente";
import { ClienteClass } from "../../models/clases/Cliente";

export interface ResultadoItemCliente {
  tipo: string;
  id: number;
  nombre: string;
}

interface BuscadorProps {
  buscar?: (texto: string) => Promise<ClienteClass[]>;
  onSeleccionar: (item: ClienteClass) => void;
  placeholder?: string;
}

export const BuscadorCliente: React.FC<BuscadorProps> = ({
  buscar,
  onSeleccionar,
  placeholder = "Buscar...",
}) => {
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [resultados, setResultados] = useState<ClienteClass[]>([]);
  const [cargando, setCargando] = useState(false);
  const contenedorRef = useRef<HTMLDivElement>(null);
  const [ancho, setAncho] = useState<string | number>("100%");
const { listarClientePorNombreHook } = useCliente();

  useEffect(() => {
    if (contenedorRef.current) {
      setAncho(contenedorRef.current.offsetWidth);
    }
    const onResize = () => {
      if (contenedorRef.current) {
        setAncho(contenedorRef.current.offsetWidth);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const manejarCambio = (e: CustomEvent) => {
    const texto = e.detail.value ?? "";
    setTextoBusqueda(texto);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      const texto = textoBusqueda.trim();

      if (texto === "") {
        setResultados([]);
        setCargando(false);
        return;
      }

      setCargando(true);
      try {
        const resultadosBusqueda = await listarClientePorNombreHook(texto);
        setResultados(resultadosBusqueda.data.objeto);
      } catch (error) {
        setResultados([]);
      } finally {
        setCargando(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [textoBusqueda]);

  const manejarSeleccion = (item: ClienteClass) => {
    onSeleccionar(item);
    setTextoBusqueda("");
    setResultados([]);
  };

  return (
    <div ref={contenedorRef} className="buscador-container">
      <IonSearchbar
        value={textoBusqueda}
        onIonInput={manejarCambio}
        placeholder={placeholder}
        style={{ width: "100%",flex: 1, padding: 0  }}
        mode="ios"
      />
      {(cargando || resultados.length > 0) && (
        <IonList className="buscador-lista" style={{ width: '100%' }}>
          {cargando && (
            <div className="buscador-spinner">
              <IonSpinner name="crescent" />
            </div>
          )}
          {!cargando &&
            resultados.map((item) => (
              <IonItem
                key={`${item.id}`}
                button
                onClick={() => manejarSeleccion(item)}
              >
                <IonLabel className="buscador-item-label">
                  <strong className="buscador-item-nombre">
                    {item.persona.nombre}
                  </strong>
                </IonLabel>
              </IonItem>
            ))}
        </IonList>
      )}
    </div>
  );
};
