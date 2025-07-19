import React, { useEffect, useState } from 'react';
import './ajusteStock.css';
import { useAjusteStock } from '../../../../hooks/useAjusteStock';
import { AjusteStockClass, DetalleAjusteStockClass } from '../../../../models/clases/AjusteStock';
import { calendarOutline,timeOutline, eyeOutline,trashOutline } from "ionicons/icons";
import { IonButton, IonCol, IonGrid, IonIcon, IonLabel, IonRow, IonSearchbar, useIonRouter } from '@ionic/react';
import RangoFechas from '../../../../components/compartidos/RangoFechas';
import CustomButton from '../../../../components/compartidos/CustomButton';
import { obtenerFechasPeruanas } from '../../../../utils/fechas';
import TablaPersonalizada from '../../../../components/compartidos/TablaPersonalizada';
import values from '../../../../models/clases/values';
import { parse, format } from 'date-fns';
import ReusableModal from '../../../../components/compartidos/ReusableModal';
import useToast from '../../../../hooks/alertMessage/useToast';
import CustomAlert from '../../../../components/compartidos/CustomAlert';
import ValidarCodigoModal from '../../../../components/compartidos/ValidarCodigoModal';
import { useAutorizacion } from '../../../../hooks/useAutorizacion';
import { TipoOperacion } from '../../../../models/clases/concepts';
import AutorizacionModal from '../../../../components/compartidos/AutorizacionModal';

const ExpandedComponent: React.FC<{ data: any }> = ({ data }) => <pre>{JSON.stringify(data, null, 2)}</pre>;

const data = [
  {
    id: 1,
    title: 'Beetlejuice',
    year: '1988',
  },
  {
    id: 2,
    title: 'Ghostbusters',
    year: '1984',
  },
];

const paginationComponentOptions = {
	rowsPerPageText: 'Filas por página',
	rangeSeparatorText: 'de',
	selectAllRowsItem: true,
	selectAllRowsItemText: 'Todos',
};


const AjusteStock: React.FC = () => {
    const { fechaInicioGlobal, fechaFinGlobal, fechaHoyGlobal } = obtenerFechasPeruanas(0);
    const { listarAjusteStock, LoadingComponent, anularAjusteStockHooks } = useAjusteStock();
    const [ fechaInicio, setFechaInicio ] = React.useState<string>(fechaInicioGlobal);
    const [ fechaFin, setFechaFin ] = React.useState<string>(fechaFinGlobal);
    const [ fechaHoy, setFechaHoy ] = React.useState<string>(fechaHoyGlobal);
    const [ ajusteStockLista, setAjusteStockLista] = useState<AjusteStockClass[]>([]);
    const [ ajusteStockFiltros, setAjusteStockFiltro] =  useState<AjusteStockClass>({} as AjusteStockClass);
    const [ mostrarInformacion, setMostrarInformacion] = useState<boolean>(false);
    const router = useIonRouter();
    const [isModalDetalle, setIsModalDetalle] = useState(false);
    const [ detalleAjusteStockLista, setDetalleAjusteStockLista] = useState<DetalleAjusteStockClass[]>([]);
    const { showToast, ToastComponent } = useToast();
    const [showAlertAnular, setShowAlertAnular] = useState(false);
    const [ anularAjusteStock, setAnularAjusteStock] = useState(new AjusteStockClass());
    const {
        solicitarAutorizacion,
        enviarPin,
        showModal,
        setShowModal,
        ToastComponent: ToastAutorizacion,
        LoadingComponent: LoadingAutorizacion
    } = useAutorizacion();

    useEffect(() => {
        listarAjusteStockInicio();
    }, []);

    const listarAjusteStockInicio = async() => {
        ajusteStockFiltros.fechaInicio = fechaInicio;
        ajusteStockFiltros.fechaFin = fechaFin;
        const response:any = await listarAjusteStock(ajusteStockFiltros);
        setMostrarInformacion(true);
        if(response.success){
            setAjusteStockLista(response.data.objeto);
        }
    }

    const handleEditar = (row: any) => {
        setDetalleAjusteStockLista(row.detalleAjusteStock || []);
        setIsModalDetalle(true);
    };

    const handleEliminar = async (row: any) => {
        solicitarAutorizacion({
            tipo_operacion: TipoOperacion.AnularPedido.para_correlativo,
            proceso: TipoOperacion.AnularPedido.para_cadena2,
            importe: 0,
            transaccion_id: row.id,
            accion: () => {
                confirmarAnular();
            },
            norequiereaccion: () => {
                setAnularAjusteStock(row);
                setShowAlertAnular(true);
            }
        });
    };

    const columns = [
        {
            name: 'Fecha',
            cell: (row: any) => (
            <div style={{gap: '0.5rem' }}>
                <div style={{paddingBottom:5}}><IonIcon icon={calendarOutline} ></IonIcon> {row.fecha_ajuste}</div>
                <div> <IonIcon icon={timeOutline} ></IonIcon> {format(parse(row.hora_ajuste, 'HH:mm:ss', new Date()), 'h:mm:ss a')}</div>
            </div>
            ),
            sortable: true,
        },
        {
            name: 'Tipo Ajuste',
            selector: (row: any) => row.tipo_ajuste_descripcion,
            sortable: true,
        },
        {
            name: 'Responsable',
            selector: (row: any) => row.responsable_nombre,
            sortable: true,
        },
        {
            name: 'Descripción',
            selector: (row: any) => row.descripcion,
            sortable: true,
        },
        {
            name: 'Estado',
            cell: (row: any) => (
                <span className={row.estado === 1 ? 'estado-activo' : 'estado-inactivo'}>
                    {row.estado_descripcion}
                </span>
            ),
        },
        {
            name: 'Acciones',
            cell: (row: any) => (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <div className="tooltip-icon">
                        <IonIcon
                            onClick={() => handleEditar(row)}
                            slot="icon-only"
                            className="tamanio-icon icono-ver"
                            icon={eyeOutline}
                        />
                    <span className="tooltip-text">Ver detalle</span>
                    </div>

                    <div className="tooltip-icon">
                    {
                        (() => {
                            const parseDate = (fechaStr:any) => {
                            const parts = fechaStr.split("-");
                            if (fechaStr.match(/^\d{2}-\d{2}-\d{4}$/)) {
                                // Formato dd-MM-yyyy
                                return new Date(parts[2], parts[1] - 1, parts[0]);
                            } else if (fechaStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
                                // Formato yyyy-MM-dd
                                return new Date(parts[0], parts[1] - 1, parts[2]);
                            }
                            return new Date(fechaStr);
                            };

                            const fechaAjuste = parseDate(row.fecha_ajuste);
                            const fechaHoyDate = parseDate(fechaHoy);

                            const mismaFecha =
                            fechaAjuste.getFullYear() === fechaHoyDate.getFullYear() &&
                            fechaAjuste.getMonth() === fechaHoyDate.getMonth() &&
                            fechaAjuste.getDate() === fechaHoyDate.getDate();

                            return mismaFecha && row.estado == 1 ? (
                            <IonIcon
                                onClick={() => handleEliminar(row)}
                                slot="icon-only"
                                className="tamanio-icon icono-eliminar"
                                icon={trashOutline}
                            ></IonIcon>
                            ) : (
                            <></>
                            );
                        })()
                    }
                    <span className="tooltip-text">Anular</span>
                    </div>

            </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    const handleFechasSeleccionadas = (rango: { startDate: Date; endDate: Date }) => {
        console.log("Fechas seleccionadas:", rango);
    };

    const buscar = () => {
        listarAjusteStockInicio();
    }

    const confirmarDetalle = () => {

    }

    const confirmarAnular = async () => {
        const response = await anularAjusteStockHooks(anularAjusteStock);
        if(response.success){
            showToast('Ajuste de stock anulado correctamente',3000, "success");
            setTimeout(() => {
                listarAjusteStockInicio();
            }, 2000);
        }
    }

    const cancelarAnular = () => {
    
    }

    return (
        <div className='background-home-principal'>
        {LoadingComponent}
        {ToastComponent}
        {ToastAutorizacion}
        {LoadingAutorizacion}
        <div>
            <div>
                <h1 style={{textAlign: 'center', fontWeight: 'bold'}}>AJUSTE DE STOCK</h1>
            </div>
            <div className='div-registrar-ajuste'>
                <IonButton
                    onClick={() =>
                    router.push(
                        values.rutas.rutas.homePrincipal.rutaPrincipal +
                        values.rutas.rutas.homePrincipal.ajuste_stock.nuevo,
                        "forward"
                    )
                    }
                    
                    expand={'full'}
                    className='button-nuevo-ajuste'
                >
                    + REGISTRAR AJUSTE DE STOCK
                </IonButton>
            </div>
            <div>
            <IonGrid>
                <IonRow>
                <IonCol size="12" sizeMd='12'>
                <div>
                    <IonLabel>Rango de fechas</IonLabel>
                    <div className='div-rango-fechas'>
                        <RangoFechas
                            fechaHoy={fechaHoy}
                            fechaInicio={fechaInicio}
                            fechaFin={fechaFin}
                            meses={2}
                            onChange={({ startDate, endDate }) => {
                                setFechaInicio(startDate);
                                setFechaFin(endDate);
                            }}
                        />
                        <CustomButton text="Buscar" onClick={buscar} className=''/>

                        {/* <IonButton
                            onClick={() =>
                            router.push(
                                values.rutas.rutas.homePrincipal.rutaPrincipal +
                                values.rutas.rutas.homePrincipal.ajuste_stock.nuevo,
                                "forward"
                            )
                            }
                            
                            expand={'full'}
                        >
                            + Crear
                        </IonButton> */}
                    </div>
                </div>
                </IonCol>
                <IonCol size="12" sizeMd='12'>
                   
                </IonCol>
                <IonCol size="12" sizeMd='12' class='col-busqueda'>

                </IonCol>
                </IonRow>
            </IonGrid>


            </div>
               <TablaPersonalizada
                columns={columns}
                data={ajusteStockLista}
                noDataComponent={
                    <div style={{ padding: '1rem' }}>
                    {mostrarInformacion ? 'No existen resultados' : ''}
                    </div>
                }
                showFilter={true}
                filterPlaceholder="Buscar por tipo de ajuste o responsable"
                filterFunction={(item, filterText) =>
                    (item.responsable_nombre ?? '').toLowerCase().includes(filterText.toLowerCase()) ||
                    (item.tipo_ajuste_descripcion ?? '').toLowerCase().includes(filterText.toLowerCase())
                }
            />
        </div>

        <ReusableModal
            isOpen={isModalDetalle}
            onClose={() => setIsModalDetalle(false)}
            onConfirm={confirmarDetalle}
            title="Detalle de Ajuste de Stock"
            cancelText="Cerrar"
            confirmText=""
            classN=""
        >
            <div
                style={{
                marginTop: "5px",
                backgroundColor: "#fff",
                padding: "10px",
                borderRadius: "12px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                }}
            >
                <IonGrid>
                    <IonRow
                        style={{
                        backgroundColor: "#f2f2f2",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        padding: "2px 0",
                        textAlign: "",
                        }}
                    >
                        <IonCol>Producto</IonCol>
                        <IonCol size="3">Unidad de Medida</IonCol>
                        <IonCol size="3">Cantidad</IonCol>
                        <IonCol size="3">Precio</IonCol>
                    </IonRow>
                    <div
                        style={{
                        marginTop: "5px",
                        maxHeight: "250px",
                        overflowY: "auto",
                        }}
                    >
                        {detalleAjusteStockLista.map((item, i) => (
                        <IonRow
                            key={i}
                            style={{
                            borderBottom: "1px solid #e0e0e0",
                            alignItems: "",
                            padding: "8px 0",
                            }}
                        >
                            <IonCol>{item.producto}</IonCol>
                            <IonCol size="3" style={{ textAlign: "" }}>
                            <span className={'estado-activo'}>
                                UNIDAD
                            </span>
                            </IonCol>
                            <IonCol size="3" style={{ textAlign: "" }}>
                            {item.cantidad}
                            </IonCol>
                            <IonCol size="3" style={{ textAlign: "" }}>
                            {item.precio_unitario!.toFixed(2)}
                            </IonCol>
                        </IonRow>
                        ))}
                    </div>
                </IonGrid>
            </div>
        </ReusableModal>

        <CustomAlert
            isOpen={showAlertAnular}
            header="Anular ajuste de stock"
            message="¿Estás seguro de que deseas anular este ajuste de stock?"
            onConfirm={confirmarAnular}
            onCancel={cancelarAnular}
            onDidDismiss={() => setShowAlertAnular(false)}
        />

        <AutorizacionModal isOpen={showModal} onClose={() => setShowModal(false)} onSubmit={enviarPin} />
        </div>
    );
};

export default AjusteStock;