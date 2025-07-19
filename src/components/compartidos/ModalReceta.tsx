import { IonButton, IonList, IonItem, IonLabel, IonInput, IonSpinner, IonGrid, IonRow, IonCol, IonIcon, IonSelect, IonSelectOption } from '@ionic/react';
import { useEffect, useState } from 'react';
import ReusableModal from './ReusableModal';
import { trash } from 'ionicons/icons';
import { useReceta } from '../../hooks/useReceta';
import useToast from '../../hooks/alertMessage/useToast';
import { useInsumo } from '../../hooks/useInsumo';
import { useAgregado } from '../../hooks/useAgregado';

interface ModalRecetaProps {
  isOpen: boolean;
  onClose: () => void;
  presentacionId: number;
  tipo: 'receta' | 'agregados';
}

interface Insumo   { id: number; nombre: string; }
interface Agregado { id: number; nombre: string; }

interface RecetaItem {
  id: number;
  cantidad: number;
  unidad: string;
  insumo?: Insumo; 
  agregado?: Agregado;
}

type NuevaRecetaPayload = {
  presentacion_id: number;
  cantidad: number;
  unidad: string;
  fecha_creacion: string;
  hora_creacion: string;
  insumo_id?: number;
  producto_agregado_id?: number;
};

export const ModalReceta: React.FC<ModalRecetaProps> = ({ isOpen, onClose, presentacionId, tipo }) => {
  const isReceta = tipo === 'receta';
  const [receta, setReceta] = useState<RecetaItem[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultados, setResultados] = useState<Insumo[]>([]);
  const [insumosSeleccionados, setInsumosSeleccionados] = useState<any[]>([]);
  const { obtenerReceta, crearReceta, actualizarReceta } = useReceta();
  const { obtenerAgregados, crearAgregado, actualizarAgregado } = useAgregado();
  const { showToast, ToastComponent } = useToast();
  const { obtenerInsumos } = useInsumo();

  const unidades = [
    { id: 1, nombre: "Unidades" },
    { id: 2, nombre: "Gramos" },
    { id: 3, nombre: "Kilogramos" },
    { id: 4, nombre: "Mililitros" },
    { id: 5, nombre: "Litros" },
  ];

  useEffect(() => {
    if (isOpen) {
      cargarDatos();
    }
  }, [isOpen]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      if (presentacionId == null || isNaN(presentacionId)) {
        console.error("ID inválido:", presentacionId);
        return;
      }
      const presId = Number(presentacionId);

      const response = isReceta ? await obtenerReceta({ presentacion_id: presId }) : await obtenerAgregados({ presentacion_id: presId });
      const data = response?.data?.objeto || [];
      console.log("RESPUESTA",response);
      
      setReceta(data);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setReceta([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (busqueda.trim().length === 0) {
        setResultados([]);
        return;
      }

      const buscar = async () => {
        try {
          setLoading(true);
          const response = await obtenerInsumos({ texto: busqueda });
          setResultados(response?.data?.objeto || []);
        } catch (error) {
          console.error('Error al buscar:', error);
          setResultados([]);
        } finally {
          setLoading(false);
        }
      };

      buscar();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [busqueda]);

  const agregar = (item: Insumo) => {
    if (!insumosSeleccionados.find(i => i.id === item.id)) {
      setInsumosSeleccionados(prev => [
        ...prev,
        { ...item, cantidad: 1, unidad: unidades[0].id }
      ]);
    }
    setBusqueda('');
    setResultados([]);
  };

  const actualizarCampo = (id: number, campo: string, valor: any) => {
    setInsumosSeleccionados(prev =>
      prev.map(item => item.id === id ? { ...item, [campo]: valor } : item)
    );
  };

  const agregarAReceta = async (item: any) => {
    const now = new Date();
    const fecha = now.toISOString().split('T')[0];
    const hora = now.toTimeString().split(' ')[0];

    try {
      setLoading(true);

      const nuevaReceta: NuevaRecetaPayload = {
        presentacion_id: presentacionId,
        cantidad: item.cantidad,
        unidad: item.unidad,
        fecha_creacion: fecha,
        hora_creacion: hora,
      };

      if (tipo === 'receta') {
        nuevaReceta.insumo_id = item.id;
      } else {
        nuevaReceta.producto_agregado_id = item.id;
      }

      console.log('Datos a enviar:', nuevaReceta);
      
      const response = isReceta ? await crearReceta(nuevaReceta) : await crearAgregado(nuevaReceta);
      console.log('Datos cargados:', response);
      if (!response.success) {
        showToast("Error al agregar", 3000, "danger");
        return;
      }

      showToast("Agregado correctamente", 3000, "success");
      await cargarDatos();
      setInsumosSeleccionados(prev => prev.filter(i => i.id !== item.id));
    } catch (error) {
      console.error("Error al agregar:", error);
    } finally {
      setLoading(false);
    }
  };

  const eliminarDeReceta = async (id: number) => {
    try {
      setLoading(true);
      const response = isReceta
        ? await actualizarReceta({ id })
        : await actualizarAgregado({ id });

      if (!response.success) {
        showToast("Error al eliminar", 3000, "danger");
        return;
      }

      showToast("Eliminado correctamente", 3000, "success");
      await cargarDatos();
    } catch (error) {
      console.error("Error al eliminar:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReusableModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onClose}
      title={isReceta ? 'Receta de presentación' : 'Productos agregados'}
      cancelText="Cerrar"
      confirmText="OK"
      classN="modal-receta"
    >
      {/* Input de búsqueda */}
      <IonItem>
        <IonLabel position="stacked">
          {isReceta ? 'Buscar insumo' : 'Buscar agregado'}
        </IonLabel>
        <IonInput
          value={busqueda}
          onIonInput={e => setBusqueda(e.detail.value!)}
          placeholder={isReceta ? "Papa, arroz, limón..." : "Kétchup, cebolla..."}
        />
      </IonItem>

      {resultados.length > 0 && (
        <IonList style={{ border: '1px solid #ccc', borderRadius: '8px' }}>
          {resultados.map(item => (
            <IonItem key={item.id} button onClick={() => agregar(item)}>
              <IonLabel>{item.nombre}</IonLabel>
            </IonItem>
          ))}
        </IonList>
      )}

      {insumosSeleccionados.length > 0 && (
        <IonGrid>
          <IonRow className="ion-text-center ion-align-items-center" style={{ fontWeight: 'bold' }}>
            <IonCol>Nombre</IonCol>
            <IonCol>Unidad</IonCol>
            <IonCol>Cantidad</IonCol>
            <IonCol>Agregar</IonCol>
          </IonRow>
          {insumosSeleccionados.map(item => (
            <IonRow key={item.id} className="ion-align-items-center ion-text-center">
              <IonCol>{item.nombre}</IonCol>
              <IonCol>
                <IonSelect
                  value={item.unidad}
                  onIonChange={e => actualizarCampo(item.id, 'unidad', e.detail.value)}
                >
                  {unidades.map(un => (
                    <IonSelectOption key={un.id} value={un.id}>{un.nombre}</IonSelectOption>
                  ))}
                </IonSelect>
              </IonCol>
              <IonCol>
                <IonInput
                  type="number"
                  value={item.cantidad}
                  onIonInput={e => actualizarCampo(item.id, 'cantidad', parseFloat(e.detail.value!))}
                />
              </IonCol>
              <IonCol>
                <IonButton color="success" size="small" onClick={() => agregarAReceta(item)}>➕</IonButton>
              </IonCol>
            </IonRow>
          ))}
        </IonGrid>
      )}

      {/* Lista actual */}
      <IonGrid>
        <IonRow className="ion-text-center ion-align-items-center" style={{ fontWeight: 'bold', borderBottom: '1px solid #ccc' }}>
          <IonCol>Nombre</IonCol>
          <IonCol>Unidad</IonCol>
          <IonCol>Cantidad</IonCol>
          <IonCol>Acciones</IonCol>
        </IonRow>

        {loading ? (
          <IonRow>
            <IonCol size="12" className="ion-text-center">
              <IonSpinner name="crescent" />
              <p>Cargando {isReceta ? 'receta' : 'agregados'}...</p>
            </IonCol>
          </IonRow>
        ) : receta.length === 0 ? (
          <IonRow>
            <IonCol size="12" className="ion-text-center">
              No se encontraron {isReceta ? 'insumos' : 'agregados'}
            </IonCol>
          </IonRow>
        ) : (
          receta.map(item => (
            <IonRow key={item.id} className="ion-align-items-center ion-text-center">
              <IonCol>{isReceta ? item.insumo?.nombre : item.agregado?.nombre}</IonCol>
              <IonCol>{item.unidad}</IonCol>
              <IonCol>{item.cantidad}</IonCol>
              <IonCol>
                <IonButton color="danger" size="small" onClick={() => eliminarDeReceta(item.id)}>
                  <IonIcon icon={trash} slot="icon-only" />
                </IonButton>
              </IonCol>
            </IonRow>
          ))
        )}
      </IonGrid>
    </ReusableModal>
  );
};

