import {
  IonSearchbar,
  IonList,
  IonItem,
  IonLabel,
  IonSpinner,
} from "@ionic/react";
import React, { useState, useRef, useEffect } from "react";
import "./BuscadorList.css";
import useToast from "../../hooks/alertMessage/useToast";

export interface ResultadoItem {
  tipo: string;
  id: number;
  unida?: number;
  nombre: string;
  codigo: string;
}

interface BuscadorProps {
  buscar: (texto: string) => Promise<ResultadoItem[]>;
  onSeleccionar: (item: ResultadoItem) => void;
  placeholder?: string;
}

export const Buscador: React.FC<BuscadorProps> = ({
  buscar,
  onSeleccionar,
  placeholder = "Buscar...",
}) => {
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [resultados, setResultados] = useState<ResultadoItem[]>([]);
  const [cargando, setCargando] = useState(false);
  const contenedorRef = useRef<HTMLDivElement>(null);
  const [ancho, setAncho] = useState<string | number>("100%");
  const { showToast, ToastComponent } = useToast();

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

  // const manejarCambio = async (e: CustomEvent) => {
  //   const texto = e.detail.value ?? "";
  //   setTextoBusqueda(texto);

  //   if (texto.trim() === "") {
  //     setResultados([]);
  //     setCargando(false);
  //     return;
  //   }

  //   setCargando(true);
  //   try {
  //     const resultadosBusqueda = await buscar(texto.trim());
  //     setResultados(resultadosBusqueda);
  //   } catch (error) {
  //     console.error("Error buscando:", error);
  //     setResultados([]);
  //   } finally {
  //     setCargando(false);
  //   }
  // };

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
        const resultadosBusqueda = await buscar(texto);
        console.log("Resultados de búsqueda:", resultadosBusqueda);
        if(resultadosBusqueda.length === 0) {
          showToast("No se encontraron resultados para: " + texto, 3000, "warning");
        }
        setResultados(resultadosBusqueda);
      } catch (error) {
        console.error("Error buscando:", error);
        setResultados([]);
      } finally {
        setCargando(false);
      }
    }, 400); // 400ms de espera después de que el usuario deja de escribir

    return () => clearTimeout(delayDebounce); // limpia el timeout si el texto cambia antes de que pase el tiempo
  }, [textoBusqueda]);

  const manejarSeleccion = (item: ResultadoItem) => {
    onSeleccionar(item);
    setTextoBusqueda("");
    setResultados([]);
  };

  return (
    <div ref={contenedorRef} className="buscador-container">
      {ToastComponent}
      <IonSearchbar
        value={textoBusqueda}
        onIonInput={manejarCambio}
        placeholder={placeholder}
        style={{ width: "100%" }} // Puedes mantener esto o ponerlo en el CSS
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
                key={`${item.tipo}-${item.id}`}
                button
                onClick={() => manejarSeleccion(item)}
              >
                <IonLabel className="buscador-item-label">
                  {item.tipo && (
                    <span className="buscador-item-tipo">{item.tipo}</span>
                  )}
                  <strong className="buscador-item-nombre">
                    {item.nombre}
                    {item.codigo && (
                      <span className="buscador-item-codigo">
                        {item.codigo}
                      </span>
                    )}
                  </strong>
                </IonLabel>
              </IonItem>
            ))}
        </IonList>
      )}
    </div>
  );
};
