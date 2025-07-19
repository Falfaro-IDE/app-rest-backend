import {IonModal,IonHeader,IonToolbar,IonTitle,IonContent,IonItem,IonLabel,IonButton,IonIcon,IonFooter,IonLoading,IonText} from "@ionic/react";
import { downloadOutline } from "ionicons/icons";
import React, { useCallback, useRef, useState } from "react";
import { descargarFormato } from "./descargarFormato";
import { procesarArchivoProductos } from "./Productos_Presentaciones/probarImportProducto";
import { procesarArchivoInsumos } from "./Imsumos/probarImportInsumos";
import { importarProductosYPresentaciones } from "./Productos_Presentaciones/importarProductos";
import { importarInsumos } from "./Imsumos/importarInsumos";
import { PresentacionPreparada, ProductoPreparado } from "../../../../../models/clases/Producto";
import { closeOutline } from "ionicons/icons"; // Ícono para la "X"
import { useEffect } from "react";
import { useConceptos } from "../../../../../hooks/useConceptos";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (mensaje: string) => void;
  tipoImportacion: "productos" | "insumos";
}

// const unidadesMedida = [
//   { id: 1, nombre: "Unidades" },
//   { id: 2, nombre: "Gramos" },
//   { id: 3, nombre: "Kilogramos" },
//   { id: 4, nombre: "Mililitros" },
//   { id: 5, nombre: "Litros" },
// ];

const ImportarProductosModal: React.FC<Props> = ({isOpen,onClose,onSuccess,tipoImportacion,}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<File | null>(null);
  const [errorToast, setErrorToast] = useState<string | string[] | null>(null);
  const [cargando, setCargando] = useState(false);
  const [productos, setProductos] = useState<ProductoPreparado[]>([]);
  const [unidadesMedida, setUnidades] = useState<any[]>([]);
  const [presentaciones, setPresentaciones] = useState<PresentacionPreparada[]>([]);
  const [categoriasFaltantes, setCategoriasFaltantes] = useState<string[]>([]);
  const [insumos, setInsumos] = useState<any[]>([]);
  const { obtenerConceptos } = useConceptos();
    // ✅ Efecto para limpiar todo cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      setArchivoSeleccionado(null);
      setErrorToast(null);
      setProductos([]);
      setPresentaciones([]);
      setCategoriasFaltantes([]);
      setInsumos([]);
      setUnidades([]);
      setCargando(false);
    }
  }, [isOpen]);
  
  const fetchUnidadesMedida = async () => {
    try {
      const unidades = await obtenerConceptos({ con_prefijo: 12 });
      console.log(unidades);
      
      setUnidades(unidades.data.objeto);
    } catch (error) {
      console.error("Error al obtener insumos", error);
    }
  };

  async function ProbarImportacion() {
    if (!archivoSeleccionado) return;
    setCargando(true);
    setErrorToast("");
    if (tipoImportacion === "productos") {
      const resultado = await procesarArchivoProductos(archivoSeleccionado);
      if (resultado.errores.length > 0) {
        setErrorToast(resultado.errores);
      } else {
        setProductos(resultado.productos);
        setPresentaciones(resultado.presentaciones);
        setCategoriasFaltantes(resultado.categoriasFaltantes);
        setErrorToast("✅ Archivo procesado correctamente.");
      }
    } else {
      await fetchUnidadesMedida();
      const resultado = await procesarArchivoInsumos(archivoSeleccionado, unidadesMedida);
      if (resultado.errores.length > 0) {
        setErrorToast(resultado.errores);
      } else {
        setInsumos(resultado.insumos);
        setErrorToast("✅ Archivo de insumos procesado correctamente.");
      }
    }

    setCargando(false);
  }

  async function Importar() {
    if (cargando) return;
    setCargando(true);
    setErrorToast("");
    if (tipoImportacion === "productos") {
      if (!productos.length) {
        setErrorToast("No hay productos para importar.");
        return;
      }
      const resultado = await importarProductosYPresentaciones(productos, presentaciones);
      if (resultado.success) {
        setErrorToast(resultado.mensaje);
        onSuccess("Productos y presentaciones importados correctamente.");
        onClose();
      } else {
        setErrorToast(resultado.mensaje);
      }
    } else {
      const resultado = await importarInsumos(insumos);
    if (resultado.success) {
      setErrorToast(resultado.mensaje);
      onSuccess("Insumos importados correctamente.");
      onClose();
    } else {
      setErrorToast(resultado.mensaje);
    }
    }
    setCargando(false);
  }

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Importar productos</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonButton fill="clear" onClick={() => descargarFormato(tipoImportacion)}>
          <IonIcon slot="start" icon={downloadOutline} />
          Descargar formato {tipoImportacion === "productos" ? "productos" : "insumos"}
        </IonButton>

        <input
          type="file"
          accept=".xlsx"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={(e) => setArchivoSeleccionado(e.target.files?.[0] || null)}
        />

        <IonButton expand="block" onClick={() => fileInputRef.current?.click()}>
          Seleccionar archivo
        </IonButton>

        {archivoSeleccionado && (
          <>
            <IonItem>
              <IonLabel>
                Archivo: {archivoSeleccionado.name}
              </IonLabel>
              <IonButton
                size="small"
                color="danger"
                fill="clear"
                onClick={() => {
                  setArchivoSeleccionado(null);
                  setErrorToast(null); // opcional: también limpia errores
                  fileInputRef.current && (fileInputRef.current.value = "");
                }}
              >
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonItem>

            {errorToast && Array.isArray(errorToast) ? (
              <div className="ion-padding-start">
                <IonText color="danger">
                  <strong>Errores encontrados:</strong>
                </IonText>
                <ul className="ion-padding-start">
                  {errorToast.map((linea, index) => (
                    <li key={index}>
                      <IonText color="danger">{linea}</IonText>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              errorToast && (
                <IonText color="danger" className="ion-padding-start">
                  {errorToast}
                </IonText>
              )
            )}
          </>
        )}

        <IonLoading
          isOpen={cargando}
          message="Procesando productos..."
          spinner="crescent"
        />
      </IonContent>

      <IonFooter className="ion-padding">
        <IonButton
          expand="block"
          color="tertiary"
          onClick={() => ProbarImportacion()}
          disabled={cargando || !archivoSeleccionado}
          style={{ marginBottom: "8px" }}
        >
          {cargando ? "Procesando..." : "Probar"}
        </IonButton>

        <IonButton
          expand="block"
          color="primary"
          onClick={() => Importar()}
          disabled={cargando || !archivoSeleccionado}
        >
          {cargando ? "Procesando..." : "Importar"}
        </IonButton>

        <IonButton
          expand="block"
          color="medium"
          onClick={onClose}
          disabled={cargando}
        >
          Cancelar
        </IonButton>
      </IonFooter>
    </IonModal>
  );
};

export default ImportarProductosModal;
