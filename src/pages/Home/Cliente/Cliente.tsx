import React, { useEffect, useState } from 'react'
import { ClienteClass } from '../../../models/clases/Cliente';
import { IonButton, IonContent, IonIcon } from '@ionic/react';
import CustomButton from '../../../components/compartidos/CustomButton';
import './Cliente.css';
import TablaPersonalizada from '../../../components/compartidos/TablaPersonalizada';
import NuevoClienteModal from './NuevoClienteModal';
import { useCliente } from '../../../hooks/useCliente';
import { createOutline,eyeOutline,trashOutline } from "ionicons/icons";
import { obtenerFechasPeruanas } from '../../../utils/fechas';
import CustomAlert from '../../../components/compartidos/CustomAlert';
import { BuscadorCliente, ResultadoItemCliente } from '../../../components/compartidos/BuscadorCliente';
import ValidarCodigoModal from '../../../components/compartidos/ValidarCodigoModal';


const Cliente : React.FC = () => {
    const [ clienteLista, setClienteLista ] = useState<ClienteClass[]>([]);
    const [ mostrarInformacion, setMostrarInformacion] = useState<boolean>(false);
    const [ showClienteModal, setShowClienteModal] = useState<boolean>(false);
    const [ clienteSeleccionado, setClienteSeleccionado] = useState( new ClienteClass);
    const [ tipoRegistro, setTipoRegistro ] = useState<1 | 2>(1);
    const { listarClienteHook,registrarClienteHook, editarClienteHook, LoadingComponent, ToastComponent } = useCliente();
    const { fechaHoyGlobal, horaActualGlobal } = obtenerFechasPeruanas(0);
    const [showAlertAnular, setShowAlertAnular] = useState(false);
    const [ clienteBusqueda, setClienteBusqueda] =
        useState<ClienteClass | null>(null);
    const [ modalAbierto, setModalAbierto] = useState(true);

    useEffect(() => {
        listarCliente();
    }, []);

    const listarCliente = async () => {
        const response:any = await listarClienteHook();
        setMostrarInformacion(true);
        if(response.success){
            console.log("response", JSON.stringify(response.data.objeto));
            setClienteLista(response.data.objeto);
        }
    }


    const handleEditar = (row: any) => {
        console.log("cliente", row);
        setClienteSeleccionado(row);
        setTipoRegistro(2);
        setShowClienteModal(true);
    };

    const handleEliminar = async (row: any) => {
        setClienteSeleccionado(row);
        setShowAlertAnular(true);
    };

    const confirmarAnular = async () => {
        const response = await editarClienteHook({
            ...clienteSeleccionado,
            estado: 1,
            persona: {
                ...clienteSeleccionado.persona,
                estado: 1
            }
        });
        if(response.success){
            listarCliente();
        }
    }

    const cancelarAnular = () => {
    }
    

    const columns = [
        {
            name: 'Documentos',
            cell: (row: any) => (
                <div>
                    {row.persona.documentos.map((doc: any, index: number) => (
                        <div key={index}>
                            <strong>{doc.tipoDocumento?.para_cadena1 || 'Tipo desconocido'}:</strong> {doc.numero}
                        </div>
                    ))}
                </div>
                
            ),
        },
        {
            name: 'Nombre',
            selector: (row: any) => row.persona.nombre,
            sortable: true,
        },
        {
            name: 'Email',
            selector: (row: any) => row.persona.email,
            sortable: true,
        },
        {
            name: 'Direccion',
            selector: (row: any) => row.persona.direccion,
            sortable: true,
        },
        {
            name: 'Estado',
            cell: (row: any) => (
                <span className={row.estado === 0 ? 'estado-activo-cliente' : 'estado-inactivo'}>
                    { row.estado == 0 ? 'Activo': 'Inactivo'}
                </span>
                
            ),
        },
        {
            name: 'Acciones',
            cell: (row: any) => (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div className="tooltip-icon">
                    <IonIcon onClick={() => handleEditar(row)} slot="icon-only" className='tamanio-icon icono-ver' icon={createOutline}></IonIcon>
                    <span className="tooltip-text">Editar</span>
                </div>
                <div className="tooltip-icon">
                    <IonIcon
                        onClick={() => handleEliminar(row)}
                        slot="icon-only"
                        className="tamanio-icon icono-eliminar"
                        icon={trashOutline}
                    ></IonIcon>
                    <span className="tooltip-text">Eliminar</span>
                </div>
            </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

  const handleLoginClick = () => {
    setTipoRegistro(1);
    setShowClienteModal(true);
  }

  const registrarCliente = async (clienteActualizado: ClienteClass) => {
    console.log("cliente", clienteActualizado);
    if(clienteActualizado.id!){
        setTimeout(() => {
            setShowClienteModal(false);
            listarCliente();
        }, 1000);
    }
  }  
  
  return (
     <div className='background-home-principal'>
        {LoadingComponent}
        {ToastComponent}
         <div>
              <h1 style={{textAlign: 'center', fontWeight: 'bold'}}>CLIENTES</h1>
          </div>
          <div>
            <div className='div-registrar-cliente'>
              <CustomButton text="+ REGISTRAR CLIENTE" onClick={handleLoginClick} expand={'full'} className='button-nuevo-cliente'/>
            </div>
            <div className='tabla-clientes'>
              <TablaPersonalizada
                columns={columns}
                data={clienteLista}
                noDataComponent={
                    <div style={{ padding: '1rem' }}>
                    {mostrarInformacion ? 'No existen resultados' : ''}                                                     
                    </div>
                }
                showFilter={true}
                filterPlaceholder="Buscar por documentos,nombres o email"
                filterFunction={(item, filterText) => {
                    const nombre = (item.persona.nombre ?? '').toLowerCase();
                    const email = (item.persona.email ?? '').toLowerCase();
                    const texto = filterText.toLowerCase();

                    // Buscar en nombre, email o en documentos.numero
                    const coincideDocumento = (item.persona.documentos ?? []).some((doc: any) =>
                    (doc.numero ?? '').toLowerCase().includes(texto)
                    );

                    return nombre.includes(texto) || email.includes(texto) || coincideDocumento;
                }}
              />
            </div>

            <div>
            <NuevoClienteModal
                isOpen={showClienteModal}
                onClose={() => setShowClienteModal(false)}
                onConfirm={(clienteActualizado) => {
                    // Guardar en backend o actualizar lista
                    registrarCliente(clienteActualizado);
                }}
                cliente={clienteSeleccionado}
                modo={tipoRegistro}
            />
            </div>
            <div>
                <CustomAlert
                    isOpen={showAlertAnular}
                    header="Eliminar cliente"
                    message="¿Estás seguro que deseas eliminar el cliente?, esta acción no se revertirá."
                    onConfirm={confirmarAnular}
                    onCancel={cancelarAnular}
                    onDidDismiss={() => setShowAlertAnular(false)}
                />
            </div>
          </div>
     </div>
  )
}

export default Cliente;