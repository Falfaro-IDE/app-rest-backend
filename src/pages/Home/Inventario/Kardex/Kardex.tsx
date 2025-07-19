import { IonButton, IonCard, IonCardContent, IonCol, IonGrid, IonIcon, IonLabel, IonRow } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import './Kardex.css';
import TablaPersonalizada from '../../../../components/compartidos/TablaPersonalizada';
import { KardexClass } from '../../../../models/clases/Kardex';
import { obtenerFechasPeruanas } from '../../../../utils/fechas';
import { useKardex } from '../../../../hooks/useKardex';
import useToast from '../../../../hooks/alertMessage/useToast';
import { calendarOutline,timeOutline, eyeOutline,trashOutline } from "ionicons/icons";
import { parse, format } from 'date-fns';
import RangoFechas from '../../../../components/compartidos/RangoFechas';
import values from '../../../../models/clases/values';
import { Buscador, ResultadoItem } from '../../../../components/compartidos/BuscadorList';
import { useInsumo } from '../../../../hooks/useInsumo';
import { useProducto } from '../../../../hooks/useProducto';
import ExportarProductos from '../../Ajustes/Producto/Import_Export/ExportarProductos';
import CartTotales from '../../../../components/compartidos/cartTotales';
import CustomButton from '../../../../components/compartidos/CustomButton';

const Kardex: React.FC = () => {
    const { fechaInicioGlobal, fechaFinGlobal, fechaHoyGlobal } = obtenerFechasPeruanas(7);
    const [ fechaInicio, setFechaInicio ] = React.useState<string>(fechaInicioGlobal);
    const [ fechaFin, setFechaFin ] = React.useState<string>(fechaFinGlobal);
    const [ fechaHoy, setFechaHoy ] = React.useState<string>(fechaHoyGlobal);
    const [ kardexFiltros, setKardexFiltros] =  useState<KardexClass>({} as KardexClass);
    const { listarKardexHooks, LoadingComponent } = useKardex();
    const [ mostrarInformacion, setMostrarInformacion] = useState<boolean>(false);
    const [ kardexLista, setKardexLista] = useState<KardexClass[]>([]);
    const { showToast, ToastComponent } = useToast();
    const [ cantidadEntradas, setCantidadEntradas ] = useState<number>(0);
    const [ cantidadSalidas, setCantidadSalidas ] = useState<number>(0);
    const [ stockInicial, setStockInicial ] = useState<number>(0);
    const [ stockFinal, setStockFinal ] = useState<number>(0);
    const { obtenerInsumos } = useInsumo();
    const { obtenerPresentacionesTexto } = useProducto();
        const [productoSeleccionado, setProductoSeleccionado] =
            useState<ResultadoItem | null>(null);
    const [textoBusqueda, setTextoBusqueda] = useState("");

    useEffect(() => {
        //listarKardex();
        console.log("producto seleccionado:", productoSeleccionado);
    }, []);

    const listarKardex = async(productoSeleccionado: any) => {
        console.log("producto seleccionado:", productoSeleccionado);
        if (!productoSeleccionado) {
            showToast("Debe ingresar un producto en la búsqueda", 3000, "warning");
            return;
        }
        kardexFiltros.fechaInicio = fechaInicio;
        kardexFiltros.fechaFin = fechaFin;
        kardexFiltros.presentacionId = 0; // Puedes ajustar esto según tus necesidades
        kardexFiltros.insumoId = 0;
        if(productoSeleccionado){
            productoSeleccionado?.tipo === "insumo"
            ? (kardexFiltros.insumoId = productoSeleccionado.id)
            : (kardexFiltros.presentacionId = productoSeleccionado!.id);
        }
 
        //kardexFiltros.presentacionId = 16; // Puedes ajustar esto según tus necesidades
        //kardexFiltros.insumoId = 0;
        const response:any = await listarKardexHooks(kardexFiltros);
        setMostrarInformacion(true);
        if(response.success){
            console.log("Kardex data:", response.data.objeto.listaKardex);
            setCantidadEntradas(response.data.objeto.cantidadEntrada);
            setCantidadSalidas(response.data.objeto.cantidadSalida);
            setStockInicial(response.data.objeto.stockInicial);
            setStockFinal(response.data.objeto.stockFinal);
            setKardexLista(response.data.objeto.listaKardex);
        }else{
             showToast('Error al listar kardex',3000, "danger");
        }
    }

    const columns:any = [
        {
            name: (
                <div style={{ textAlign: 'center' }}>
                    <div style={{ color: 'red', fontWeight: 'bold' }}></div>
                    <div style={{ fontSize: '', marginTop: '20px'}}>Fecha</div>
                </div>
            ),
            maxWidth: '180px',
            cell: (row: any) => (
            <div style={{gap: '0.5rem' }}>
                <div style={{paddingBottom:5}}><IonIcon icon={calendarOutline} ></IonIcon> {row.fecha_operacion}</div>
                <div> <IonIcon icon={timeOutline} ></IonIcon> {format(parse(row.hora_operacion, 'HH:mm:ss', new Date()), 'h:mm:ss a')}</div>
            </div>
            ),
            sortable: true,
            nombre: 'Fecha y Hora',
            selector: (row: any) => row.fecha_operacion + ' ' + row.hora_operacion,
        },
        {
            name: (
                <div style={{ textAlign: 'center' }}>
                    <div style={{ color: 'red', fontWeight: 'bold' }}></div>
                    <div style={{ fontSize: '', marginTop: '20px'}}>Concepto</div>
                </div>
            ),
            cell: (row: any) => (
            <div style={{gap: '0.5rem' }}>
                <div style={{paddingBottom:5}}>{row.tipo_movimiento_descripcion} POR {row.tipo_proceso_descripcion}</div>
                <div style={{paddingBottom:5}}>{ row.codigo_transaccion}</div>
            </div>
            ),
            sortable: true,
            nombre: 'Concepto',
            selector: (row: any) => row.tipo_movimiento_descripcion + ' POR ' +row.tipo_proceso_descripcion,
        },
        {
             name: (
                <div style={{ textAlign: 'center' }}>
                    <div style={{ color: 'red', fontWeight: 'bold' }}></div>
                    <div style={{ fontSize: '', color: '#2ecc71', marginTop: '20px' }}>Cantidad</div>
                </div>
            ),
            maxWidth: '150px',
            cell: (row: any) => (
            <div style={{gap: '0.5rem' }}>
                {
                    row.tipo_movimiento === 1 ? (
                        <div style={{paddingBottom:5}}>{Number(row.cantidad).toFixed(values.numeros.decimalesKardex)}</div>
                    ) : (
                        <div style={{paddingBottom:5}}>-</div>
                    )
                }
            </div>
            ),
            style: { color: '#2ecc71' },
            nombre: 'Cantidad Entrada',
            selector: (row: any) => row.tipo_movimiento === 1 ? row.cantidad: '',
        },
        {
             name: (
                <div style={{ textAlign: 'center' }}>
                    <div style={{ color: '#2ecc71',fontSize:'13px', }}>Entrada</div>
                    <div style={{ fontSize: '', color: '#2ecc71',marginTop: '10px'}}>C.U</div>
                </div>
            ),
            maxWidth: '150px',
            cell: (row: any) => (
            <div style={{gap: '0.5rem' }}>
                {
                    row.tipo_movimiento === 1 ? (
                        <div style={{paddingBottom:5}}>{row.costo_unitario}</div>
                    ) : (
                        <div style={{paddingBottom:5}}>-</div>
                    )
                }
            </div>
            ),
            style: { color: '' },
            nombre: 'Costo Unitario Entrada',
            selector: (row: any) => row.tipo_movimiento === 1 ? row.costo_unitario: '',
        },
                {
             name: (
                <div style={{ textAlign: 'center' }}>
                    <div style={{ color: '#2ecc71',fontSize:'13px'}}></div>
                    <div style={{ fontSize: '', color: '#2ecc71',marginTop: '20px'}}>Total</div>
                </div>
            ),
            maxWidth: '150px',
            cell: (row: any) => (
            <div style={{gap: '0.5rem' }}>
                {
                    row.tipo_movimiento === 1 ? (
                        <div style={{paddingBottom:5}}>{row.costo_total}</div>
                    ) : (
                        <div style={{paddingBottom:5}}>-</div>
                    )
                }
            </div>
            ),
            style: { color: '' },
            nombre: 'Total Entrada',
            selector: (row: any) => row.tipo_movimiento === 1 ? row.costo_total: '',
        },
        {
             name: (
                <div style={{ width: '100px' }}>
                    <div style={{ color: 'red', fontWeight: 'bold' }}></div>
                    <div style={{ fontSize: '', color: 'red', marginTop: '20px' }}>Cantidad</div>
                </div>
            ),
            maxWidth: '150px',
            cell: (row: any) => (
            <div style={{gap: '0.5rem',}}>
              {
                    row.tipo_movimiento === 2 ? (
                        <div style={{paddingBottom:5}}>{Number(row.cantidad).toFixed(values.numeros.decimalesKardex)}</div>
                    ) : (
                        <div style={{paddingBottom:5}}>-</div>
                    )
                }
            </div>
            ),
            style: { color: 'red' },
            nombre: 'Cantidad Salida',
            selector: (row: any) => row.tipo_movimiento === 2 ? row.cantidad: '',
        },
        {
             name: (
                <div style={{ width: '100px' }}>
                    <div style={{ color: 'red',fontSize:'13px', }}>Salida</div>
                    <div style={{ fontSize: '', color: 'red',marginTop: '10px'}}>C.U</div>
                </div>
            ),
            maxWidth: '150px',
            cell: (row: any) => (
            <div style={{gap: '0.5rem' }}>
              {
                    row.tipo_movimiento === 2 ? (
                        <div style={{paddingBottom:5}}>{row.costo_unitario}</div>
                    ) : (
                        <div style={{paddingBottom:5}}>-</div>
                    )
                }
            </div>
            ),
            style: { color: '' },
            nombre: 'Costo Unitario Salida',
            selector: (row: any) => row.tipo_movimiento === 2 ? row.costo_unitario: '',
        },
                {
             name: (
                <div style={{ width: '100px' }}>
                    <div style={{ color: '#2ecc71',fontSize:'13px'}}></div>
                    <div style={{ fontSize: '', color: 'red',marginTop: '20px'}}>Total</div>
                </div>
            ),
            maxWidth: '150px',
            cell: (row: any) => (
            <div style={{gap: '0.5rem' }}>
              {
                    row.tipo_movimiento === 2 ? (
                        <div style={{paddingBottom:5}}>{row.costo_total}</div>
                    ) : (
                        <div style={{paddingBottom:5}}>-</div>
                    )
                }
            </div>
            ),
            style: { color: '' },
            nombre: 'Costo Total Salida',
            selector: (row: any) => row.tipo_movimiento === 2 ? row.costo_total: '',
        },
    ];

    const buscarProductos = async (texto: string): Promise<ResultadoItem[]> => {
        const textoLimpio = texto.trim();
        if (!textoLimpio) return [];

        try {
        const [respInsumos, respPresentaciones] = await Promise.all([
            obtenerInsumos({ texto }),
            obtenerPresentacionesTexto(texto),
        ]);

        const insumos = (respInsumos?.data?.objeto || []).map((insumo: any) => ({
            tipo: "insumo",
            id: insumo.id,
            unida: insumo.unidad_medida,
            nombre: insumo.nombre,
            codigo: insumo.codigo,
        }));

        const presentaciones = (respPresentaciones?.data?.objeto || []).map(
            (p: any) => ({
            tipo: "presentacion",
            id: p.idPresentacion,
            nombre: p.descripcion,
            codigo: p.codigoPresentacion,
            })
        );

        return [...insumos, ...presentaciones];
        } catch (error) {
        console.error("Error:", error);
        return [];
        }
    };


    return (
        <div className='background-home-principal scroll-horizontal-kardex'>
            {ToastComponent}
            {LoadingComponent}
            <div>
                <div>
                    <h1 style={{textAlign: 'center', fontWeight: 'bold'}}>INVENTARIO DE KARDEX</h1>
                </div>
                <IonGrid>
                    <div
                        style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "12px",
                        marginBottom: "12px",
                        }}
                    >
                        <div>
                        <IonLabel>Rango de fechas</IonLabel>
                            <div className="div-rango-fechas">
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
                                <CustomButton
                                    text="Buscar"
                                    onClick={() => listarKardex(productoSeleccionado)}
                                    expand="full"
                                />
                             </div>
                        </div>
                        <div style={{ flex: "1 1 280px" }}>
                        <IonLabel>Buscar producto o insumo</IonLabel>
                        <Buscador
                            buscar={buscarProductos}
                            placeholder={
                                textoBusqueda
                                ? `📦 ${textoBusqueda}`
                                : "Buscar nombre de producto o insumo"
                            }
                            onSeleccionar={(item) => {
                                console.log("item seleccionado:", item);
                                setTextoBusqueda(item.nombre);
                                setProductoSeleccionado(item);
                                listarKardex(item);
                            }}
                        />
                        </div>

                    </div>
                    
                    <div>
                        {
                            productoSeleccionado ? (
                            <div className='div-seleccinado'>
                                {/* <h3>{productoSeleccionado.nombre}</h3> */}
                                <div className='div-button-crear'>
                                    {/* <IonButton
                                        onClick={() =>
                                            listarKardex()
                                        }
                                        style={{ height: "fit-content" }}
                                    >
                                    Buscar
                                    </IonButton> */}
                                    {
                                        kardexLista.length > 0 ? (
                                            <ExportarProductos
                                                items={kardexLista}
                                                columnasPersonalizadas={Object.fromEntries(
                                                    columns.map((col:any) => [col.nombre, col.selector])
                                                )}
                                                nombreArchivo="inventario_kardex.xlsx"
                                            />
                                        ) :
                                            <></>
                                    }
                                </div>
                            </div>
                                
                            ) : (
                                <h3></h3>
                            )
                        }
                        {/*  <h3>Seleccionado: {productoSeleccionado?.nombre} </h3> */}
                    </div>


                    <IonRow>
                    {[
                        {
                        label: "Stock inicial",
                        value: Number(stockInicial).toFixed(values.numeros.decimalesKardex),
                        color: "#a0a0a0",
                        },
                        {
                        label: "Cantidad de entradas",
                        value: Number(cantidadEntradas).toFixed(values.numeros.decimalesKardex),
                        color: "#2dd36f",
                        },
                        {
                        label: "Cantidad de salidas",
                        value: Number(cantidadSalidas).toFixed(values.numeros.decimalesKardex),
                        color: "#eb445a",
                        },
                        {
                        label: "Stock final",
                        value: Number(stockFinal).toFixed(values.numeros.decimalesKardex),
                        color: "#3880ff",
                        },
                    ].map((item, i) => (
                        <IonCol key={i} size="12" sizeMd="3">
                        <CartTotales
                            color={item.color}
                            descripcion={item.label}
                            numero={Number(item.value)}
                        />
                        </IonCol>
                    ))}
                    </IonRow>

                    <TablaPersonalizada
                        columns={columns}
                        data={kardexLista}
                        noDataComponent={
                            <div style={{ padding: '1rem' }}>
                            {mostrarInformacion ? 'Realice una búsqueda para ver resultados' : ''}
                            </div>
                        }
                        showFilter={true}
                        filterPlaceholder="Buscar por fecha o concepto"
                        filterFunction={(item, filterText) =>
                            (item.tipo_proceso_descripcion ?? '').toLowerCase().includes(filterText.toLowerCase()) ||
                            (item.tipo_movimiento_descripcion ?? '').toLowerCase().includes(filterText.toLowerCase()) ||
                            (item.codigo_transaccion ?? '').toLowerCase().includes(filterText.toLowerCase()) ||
                            (item.fecha_operacion ?? '').toLowerCase().includes(filterText.toLowerCase())
                        }
                    />
                </IonGrid>
                
            </div>
        </div>
    )
}

export default Kardex