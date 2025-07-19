import React, { useEffect, useState } from "react";
import {
  IonButton,
  IonCheckbox,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { add, pencilOutline, trashOutline } from "ionicons/icons";
import { useCaja } from "../../../../hooks/useCaja";
import TablaPersonalizada from "../../../../components/compartidos/TablaPersonalizada";
import ReusableModal from "../../../../components/compartidos/ReusableModal";
import useToast from "../../../../hooks/alertMessage/useToast";
import { useUsuario } from "../../../../hooks/useUsuario";
import values from "../../../../models/clases/values";
import { StorageService } from "../../../../utils/storageService";
import { useImpresora } from "../../../../hooks/useImpresora";

interface Caja {
  id: number;
  descripcion: string;
  impresora: { id: number; nombre: string };
  estado: number;
  usuario: {id: number; usuario: string};
}

const Cajas: React.FC = () => {
  const { obtenerCajas, crearCaja, actualizarCaja, LoadingComponent } =
    useCaja();
  const { obtenerUsuarioPerfil } = useUsuario();
  const { obtenerImpresoras } = useImpresora();
  const { showToast, ToastComponent } = useToast();
  const [cajas, setCajas] = useState<Caja[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [impresoras, setImpresoras] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCaja, setSelectedCaja] = useState<Caja | null>(null);
  const usuario = StorageService.getItem(values.storage.keySession);
  const [formData, setFormData] = useState({
    nombre: "",
    impresora_id: 0,
    estado: true, // true = activo (0), false = inactivo (1)
    usuario_id: 0,
  });

  const fetchCajas = async () => {
    const perfil = usuario.objeto.idPerfil;
    const res = await obtenerCajas(perfil);
    if (res?.data?.objeto) {
      setCajas(res.data.objeto);
    }
  };

  const obtenerUsuarios = async () => {
    const perfil = 2;
    const res = await obtenerUsuarioPerfil(perfil);
    if (res?.data?.objeto) {
      setUsuarios(res.data.objeto);
    }
  };
  const listarImpresoras = async () => {
    const res = await obtenerImpresoras();
    if (res?.data?.objeto) {
      setImpresoras(res.data.objeto);
    }
  };
  useEffect(() => {
    fetchCajas();
    obtenerUsuarios();
    listarImpresoras();
  }, []);

  const handleOpenModal = (caja: Caja | null = null) => {
    setSelectedCaja(caja);
    if (caja) {
      setFormData({
        nombre: caja.descripcion,
        impresora_id: caja.impresora?.id,
        estado: caja.estado === 0, // true si activo
        usuario_id: caja.usuario.id, // true si activo
      });
    } else {
      setFormData({ nombre: "", impresora_id: 0, estado: true, usuario_id: 0 });
    }
    setIsModalOpen(true);
  };

  const handleConfirmModal = async () => {
    const now = new Date();
    const fecha_creacion = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const hora_creacion = now.toTimeString().split(" ")[0]; // HH:MM:SS

    const payloadBase = {
      descripcion: formData.nombre,
      impresora_id: formData.impresora_id,
      estado: formData.estado ? 0 : 1, // 0 activo, 1 inactivo
      usuario_id: formData.usuario_id,
    };
    console.log(payloadBase);
    

    if (selectedCaja) {
      const payload = { id: selectedCaja.id, ...payloadBase };
      const res = await actualizarCaja(payload);
      if (res.success) {
        showToast("Caja actualizada");
        fetchCajas();
      }
    } else {
      const payload = {
        ...payloadBase,
        fecha_creacion,
        hora_creacion,
      };
      const res = await crearCaja(payload);
      if (res.success) {
        showToast("Caja creada");
        fetchCajas();
      }
    }

    setIsModalOpen(false);
  };

  const handleDeleteCaja = async (caja: Caja) => {
    const payload = {
      id: caja.id,
      descripcion: caja.descripcion,
      impresora_id: caja.impresora.id,
      usuario_id: caja.usuario.id,
      estado: caja.estado,
      marca_baja: 9,
    };

    const res = await actualizarCaja(payload);
    if (res.success) {
      showToast("Caja eliminada");
      fetchCajas();
    }
  };

  const columns = [
    {
      name: "Nombre",
      selector: (row: Caja) => row.descripcion,
      sortable: true,
    },
    {
      name: "Impresora",
      selector: (row: Caja) => row.impresora?.nombre || "",
      sortable: true,
    },
    {
      name: "Cajero",
      selector: (row: Caja) => row.usuario?.usuario || "",
      sortable: true,
    },
    {
      name: "Estado",
      cell: (row: Caja) => (
        <span
          style={{
            color: row.estado === 0 ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          {row.estado === 0 ? "Activo" : "Inactivo"}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Acciones",
      cell: (row: Caja) => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <div className="tooltip-icon">
            <IonIcon
              icon={pencilOutline}
              className="tamanio-icon icono-ver"
              onClick={() => handleOpenModal(row)}
            />
              <span className="tooltip-text">Editar</span>
          </div>
          <div className="tooltip-icon">
            <IonIcon
              icon={trashOutline}
              className="tamanio-icon icono-eliminar"
              onClick={() => handleDeleteCaja(row)}
            />
              <span className="tooltip-text">Eliminar</span>
          </div>
        </div>
      ),
      ignoreRowClick: true,
    },
  ];

  return (
    <div>
      {LoadingComponent}
      {ToastComponent}

      <div>
        <div>
          <h1 style={{ textAlign: "center",fontWeight: 'bold' }}>LISTADO DE CAJAS</h1>
        </div>
        <div
          style={{
            marginBottom: "1rem",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <IonButton onClick={() => handleOpenModal()}>
            <IonIcon icon={add} slot="start" /> Nueva Caja
          </IonButton>
        </div>

        <TablaPersonalizada
          columns={columns}
          data={cajas}
          showFilter
          filterFunction={(item, filterText) =>
            item.descripcion.toLowerCase().includes(filterText.toLowerCase()) ||
            item.impresora?.nombre
              .toLowerCase()
              .includes(filterText.toLowerCase())
          }
          filterPlaceholder="Buscar por nombre o impresora"
        />

        <ReusableModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmModal}
          title={selectedCaja ? "Editar Caja" : "Nueva Caja"}
          confirmText="Guardar"
        >
          <div className="ion-padding">
            <IonItem>
              <IonLabel position="stacked">Nombre</IonLabel>
              <IonInput
                value={formData.nombre}
                placeholder="Ingrese el nombre de la caja"
                onIonInput={(e) =>
                  setFormData({ ...formData, nombre: e.detail.value! })
                }
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Impresora</IonLabel>
              <IonSelect
                value={formData.impresora_id}
                placeholder="Seleccione una impresora"
                onIonChange={(e) =>
                  setFormData({ ...formData, impresora_id: e.detail.value })
                }
              >
                {impresoras.map((impresora) => (
                  <IonSelectOption key={impresora.id} value={impresora.id}>
                    {impresora.nombre}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>


            <IonItem>
              <IonLabel position="stacked">Usuario</IonLabel>
              <IonSelect
                value={formData.usuario_id}
                placeholder="Seleccione un usuario"
                onIonChange={(e) =>
                  setFormData({ ...formData, usuario_id: e.detail.value })
                }
              >
                {usuarios.map((usuario: any) => (
                  <IonSelectOption
                    key={usuario.id_usuario}
                    value={usuario.id_usuario}
                  >
                    {usuario.nombre}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>

            <IonItem lines="none">
              <IonLabel>Activo</IonLabel>
              <IonCheckbox
                slot="end"
                checked={formData.estado}
                onIonChange={(e) =>
                  setFormData({ ...formData, estado: e.detail.checked! })
                }
              />
            </IonItem>
          </div>
        </ReusableModal>
      </div>
    </div>
  );
};

export default Cajas;
