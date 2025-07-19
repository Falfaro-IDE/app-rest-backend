import React, { useState } from "react";
import { IonModal, IonButton, IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, IonButtons, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption, IonRow, IonCol, IonGrid } from "@ionic/react";
import { ClienteClass } from "../../../models/clases/Cliente";
import './NuevoClienteModal.css'
import CustomInput from "../../../components/compartidos/CustomInput";
import useToast from "../../../hooks/alertMessage/useToast";
import { useCliente } from "../../../hooks/useCliente";
import { ParametroClass } from "../../../models/clases/Parametro";
import { useParametro } from "../../../hooks/useParametro";
import CustomButton from "../../../components/compartidos/CustomButton";
import { TipoDocumento } from "../../../models/clases/concepts";

interface ReusableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (cliente:ClienteClass) => void;
  cliente?: ClienteClass;
  modo: 1 | 2; // 1:Registrar, 2: Editar
  title?: string;
  cancelText?: string;
  confirmText?: string;
  children?: React.ReactNode; 
  classN?: string;
}

const NuevoClienteModal: React.FC<ReusableModalProps> = ({ 
  isOpen,
  onClose,
  onConfirm,
  cliente,
  modo,
  title = "Modal",
  cancelText = "Cancelar",
  confirmText = "OK",
  children,
  classN
}) => {
    const [formData, setFormData] = useState<ClienteClass>(cliente ? { ...cliente } : new ClienteClass());
    const [ validaciones, setValidaciones] = useState({
      dni: false,
      email: false,
      nombre: false,
      direccion: false
    })
    const { showToast, ToastComponent: ToastFromToast } = useToast();
    const { registrarClienteHook, editarClienteHook, LoadingComponent, ToastComponent: ToastFromCliente } = useCliente();
    const [ exitoRegistro, setExitoRegistro] = useState(false);
    const [ parametro, setParametro ] = useState( new ParametroClass());
    const [ parametroLista, setParametroLista ] = useState<ParametroClass[]>([]);
    const { obtenerParametroHooks } = useParametro();
    const [ parametroSeleccion, setParametroSeleccion] = useState<number | "">("");
    const [ documentoSeleccion, setDocumentoSeleccion] = useState("");
    const [ documentosSeleccionados, setDocumentosSeleccionados] = useState<any>([]);
    const [ cantidadDocumento, setCantidadDocumento ] = useState(0);

    React.useEffect(() => {
        listarTipoDocumento();
        setExitoRegistro(false);
        if (cliente && modo === 2) {
          console.log("cliente editar", cliente);
          setFormData(cliente);
          setParametroSeleccion("");
          setDocumentoSeleccion("");
          setDocumentosSeleccionados([]);
          if (cliente && cliente.persona?.documentos) {
            cliente.persona.documentos.forEach((element: any) => {
              const doc = {
                id: element.tipo_documento_id,
                documento: element.numero,
                estado: element.estado ?? 0
              };

              setDocumentosSeleccionados((prev: any) => [...prev, doc]);
            });
          }
        } else if (modo === 1) {
          setFormData(new ClienteClass());
          setDocumentosSeleccionados([]);
          setParametroSeleccion("");
          setDocumentoSeleccion("");
        }
    }, [cliente, modo, isOpen]);

    const handleChange = (field: string, value: string) => {
        if (field === "ruc_dni" || field === "nombre" || field === "email" || field === "direccion") {
            setFormData(prev => ({
                ...prev,
                persona: {
                    ...prev.persona,
                    [field]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const confirmar = async () => {
      setExitoRegistro(true);
      let exito = false;
      let clienteCreado = new ClienteClass();
      console.log("formdata", documentosSeleccionados);
      if(documentosSeleccionados.length == 0){
        showToast("Ingrese un documento a la lista.", 3000, "warning");
        return;
      }
      if (!validarDocumentosDuplicados()) return;
      const incompleto = documentosSeleccionados.some((doc:any) => doc.id === "" || doc.documento.trim() === "");
      if (incompleto) {
        showToast("Complete el documento correctamente", 3000, "warning");
        return;
      }
      if (!formData.persona.nombre.trim()) {
        showToast("Ingrese nombre correctamente", 3000, "warning");
        return;
      }
      console.log("validaciones email", validaciones.email)
      if(!validaciones.email){
        showToast("Ingrese email correctamente.", 3000, "warning");
        return;
      }
      if(modo == 1){
        const response:any = await registrarClienteHook({...formData, documentos:documentosSeleccionados});
        if(response.success){
            console.log("response cliente registrado", response.data.objeto);
            clienteCreado = response.data.objeto;
            exito = true;
        }
      }else{
          const response:any = await editarClienteHook({...formData, documentos:documentosSeleccionados});
          if(response.success){
              console.log("response cliente registrado", response.data.objeto);
              clienteCreado = response.data.objeto;
              exito = true;
          }
      }
      onConfirm(clienteCreado);
    };

    const listarTipoDocumento = async () => {

      const response = await obtenerParametroHooks({...parametro, para_prefijo: TipoDocumento.Prefijo});
      console.log("tipos de documentos", response);
        if(response.success){
            console.log("response", JSON.stringify(response.data.objeto))
            setParametroLista(response.data.objeto);
        }
    }

    const agregar = () => {
      const incompleto = documentosSeleccionados.some((doc:any) => doc.id === "" || doc.documento === "");
      if (incompleto) {
        showToast("Complete el documento anterior antes de agregar uno nuevo", 3000, "warning");
        return;
      }
      const nuevoDocumento = {
        id: "",
        documento: "",
        estado: 0,
        maxLength: 0, // valor inicial
      };

      setDocumentosSeleccionados((prev: any) => [...prev, nuevoDocumento]);
    };

    const eliminarDocumento = (index: number) => {
      setDocumentosSeleccionados((prev:any) =>
        prev.filter((item:any, i:any) => i !== index)
      );
    };

  const validarTipoDocumento = (documentoId: number, index: number) => {
    const longitudes: { [key: number]: number } = {
      1: 8,   // DNI
      2: 12,  // RUC
      3: 20,
      4: 9,
    };

    const longitud = longitudes[documentoId] || 0;

    const nuevos = [...documentosSeleccionados];
    nuevos[index].id = documentoId;
    nuevos[index].maxLength = longitud;
    nuevos[index].documento = ""; // resetear valor por si estaba ingresado
    setDocumentosSeleccionados(nuevos);
  };

  const validarDocumentosDuplicados = (): boolean => {
    const tipos = documentosSeleccionados.map((doc:any) => doc.id);
    const tiposUnicos = new Set(tipos);

    if (tipos.length !== tiposUnicos.size) {
      showToast("No se pueden ingresar tipos de documento duplicados", 3000, "warning");
      return false;
    }

    return true;
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} className="modal-cliente">
      <IonHeader className="header-modal-cliente">
        <IonToolbar>
          <IonTitle>{modo === 1? "REGISTRAR CLIENTE" : "EDITAR CLIENTES"}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>✖</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {exitoRegistro && ToastFromCliente}
        {ToastFromToast}
        {LoadingComponent}
        <div className="ion-padding div-bottom-agregar">
          <IonRow>
              <IonCol size="12" sizeMd='6'>
                <CustomButton text=" + Agregar documento" onClick={agregar} expand={'full'} className=''/>
              </IonCol>
            </IonRow>
        </div>
        <div className="ion-padding">
            <div>
                <IonGrid>
                  <IonRow style={{ borderRadius: "8px", fontWeight: "bold", padding: "2px 0" }}>
                    <IonCol size="4">Tipo</IonCol>
                    <IonCol size="5">Documento</IonCol>
                    <IonCol size="3">Acción</IonCol>
                  </IonRow>

                  <div style={{ marginTop: "5px" }}>
                    {documentosSeleccionados.map((item: any, i: number) => (
                      <IonRow key={i} style={{ borderBottom: "1px solid #e0e0e0", alignItems: "center", padding: "8px 0" }}>
                        {/* Combo tipo documento */}
                        <IonCol size="4">
                          <IonSelect
                            value={item.id}
                            interface="popover"
                            onIonChange={(e) => {
                              const newList = [...documentosSeleccionados];
                              newList[i].id = Number(e.detail.value);
                              setDocumentosSeleccionados(newList);
                              validarTipoDocumento(Number(e.detail.value), i)
                            }}
                          >
                            <IonSelectOption value="" disabled>Seleccionar</IonSelectOption>
                            {parametroLista
                              .filter((item) => item.para_correlativo !== 0)
                              .map((tipo) => (
                                <IonSelectOption key={tipo.para_correlativo} value={tipo.para_correlativo}>
                                  {tipo.para_cadena1}
                                </IonSelectOption>
                              ))}
                          </IonSelect>
                        </IonCol>

                        {/* Input documento */}
                        <IonCol size="5">
                          <IonInput
                            value={item.documento}
                            maxlength={item.maxLength || undefined}
                            onIonChange={(e) => {
                              const newList = [...documentosSeleccionados];
                              newList[i].documento = e.detail.value as string;
                              setDocumentosSeleccionados(newList);
                            }}
                            placeholder="Ingrese número"
                          />
                        </IonCol>

                        {/* Botón eliminar */}
                        <IonCol size="3">
                          <IonButton color="danger" size="small" onClick={() => eliminarDocumento(i)}>
                            Eliminar
                          </IonButton>
                        </IonCol>
                      </IonRow>
                    ))}
                    {
                      documentosSeleccionados.length == 0 && (
                        <div style={{textAlign: 'center', marginTop: 10}}>
                          <span>Ningún documento agregado</span>
                        </div>
                      )
                    }
                  </div>
                </IonGrid>
            </div>
        </div>
        <IonItem>
          <IonLabel position="stacked">Nombre *</IonLabel>
          <CustomInput
            label=""
            type="text"
            value={formData.persona.nombre}
            onIonChange={(e) => handleChange("nombre", e.detail.value!)}
            placeholder="Ingrese su nombre"
            required={false}
            className='color-input-app'
            onValidate={(isValid: boolean) => setValidaciones(prev => ({ ...prev, nombre: isValid }))}
            labelPlacement=""
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Email</IonLabel>
          <CustomInput
            label=""
            type="email"
            value={formData.persona.email}
            onIonChange={(e) => handleChange("email", e.detail.value!)}
            placeholder="Ingrese su email"
            required={false}
            className='color-input-app'
            onValidate={(isValid: boolean) => setValidaciones(prev => ({ ...prev, email: isValid }))}
            labelPlacement=""
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Dirección</IonLabel>
          <CustomInput
            label=""
            type="text"
            value={formData.persona.direccion}
            onIonChange={(e) => handleChange("direccion", e.detail.value!)}
            placeholder="Ingrese su dirección"
            required={false}
            className='color-input-app'
            onValidate={(isValid: boolean) => setValidaciones(prev => ({ ...prev, direccion: isValid }))}
            labelPlacement=""
          />
        </IonItem>
      </IonContent>

      <IonFooter className="footer-modal-cliente">
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton color="danger" onClick={onClose}>{cancelText}</IonButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton color="primary" onClick={confirmar}>
                {modo === 1 ? "Registrar" : "Actualizar"}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonFooter>
    </IonModal>
  );
};

export default NuevoClienteModal;