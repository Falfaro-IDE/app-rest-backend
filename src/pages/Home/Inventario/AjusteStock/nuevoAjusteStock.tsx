import { IonAlert, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonGrid, IonIcon, IonInput, IonItem, IonLabel, IonRow, IonSelect, IonSelectOption, IonSpinner, IonText, IonTextarea, useIonRouter } from '@ionic/react'
import React, { useEffect, useState } from 'react'
import { Buscador, ResultadoItem } from '../../../../components/compartidos/BuscadorList';
import './nuevoAjusteStock.css'
import { useConceptos } from '../../../../hooks/useConceptos';
import useToast from '../../../../hooks/alertMessage/useToast';
import { useAuth } from '../../../../hooks/useAuth';
import { useInsumo } from '../../../../hooks/useInsumo';
import { useProducto } from '../../../../hooks/useProducto';
import { ProductoSeleccionado } from '../../../../components/compartidos/ProductoSeleccionado';
import { AjusteStockClass, DetalleAjusteStockClass } from '../../../../models/clases/AjusteStock';
import { obtenerFechasPeruanas } from '../../../../utils/fechas';
import { trash } from "ionicons/icons";
import values from '../../../../models/clases/values';
import { useAjusteStock } from '../../../../hooks/useAjusteStock';

const nuevoAjusteStock : React.FC = () => {
    const [tipoAjuste, setTipoAjuste] = useState<number | "">("");
    const [responsable, setResponsable] = useState<number | "">("");
    const [productoSeleccionado, setProductoSeleccionado] =
    useState<ResultadoItem | null>(null);
    const [busqueda, setBusqueda] = useState<ResultadoItem[]>([]);
    const { obtenerConceptos, obtenerConceptosPagoCompra } = useConceptos();
    const { showToast, ToastComponent } = useToast();
    const [ listaTipoAjuste, setListaTipoAjuste] = useState<any[]>([]);
    const { listarUsuarioPersona } = useAuth();
    const [ listaResponsable, setListaResponsable] = useState<any[]>([]);
    const { obtenerInsumos } = useInsumo();
    const { obtenerPresentacionesTexto } = useProducto();
    const [ detalleAjusteStock, setDetalleAjusteStock] = useState<any[]>([]);
    const [ registrarAjusteStock, setRegistroAjusteStock] = useState( new AjusteStockClass);
    const { fechaHoyGlobal,horaActualGlobal } = obtenerFechasPeruanas(1);
    const [cargando, setCargando] = useState(false);
      const [errores, setErrores] = useState({
        tipoAjuste: false,
        responsable: false,
        descripcion: false,
      });
    const [mostrarModalExito, setMostrarModalExito] = useState(false);
    const router = useIonRouter();
    const { registrarAjusteStockHooks, LoadingComponent } = useAjusteStock();
    const [unidadesMedida, setUnidadesMedida] = useState<any[]>([]);

    /* const unidadesMedida = [
       { id: 1, con_prefijo: 1, con_correlativo: 0, nombre: "Unidades" },
        { id: 2, con_prefijo: 1, con_correlativo: 1, nombre: "Gramos" },
        { id: 3, con_prefijo: 1, con_correlativo: 2, nombre: "Kilogramos" },
        { id: 4, con_prefijo: 1, con_correlativo: 3, nombre: "Mililitros" },
        { id: 5, con_prefijo: 1, con_correlativo: 4, nombre: "Litros" },
    ];  */


    useEffect(() => {
    const fetchInformacion = async () => {
        try {
        const [compResp,unidadesMedida] = await Promise.all([
            obtenerConceptos({ con_prefijo: 7 }),
            obtenerConceptos({ con_prefijo: 12 }),
        ]);

        setListaTipoAjuste(compResp?.data?.objeto || []);
        setUnidadesMedida(unidadesMedida?.data?.objeto || []);
        listarResponsable();
        } catch {
            showToast("Error al cargar datos de compra", 3000, "danger");
        }
    };
    fetchInformacion();
    registrarAjusteStock.fecha_ajuste   = fechaHoyGlobal;
    registrarAjusteStock.hora_ajuste    = horaActualGlobal;   
    registrarAjusteStock.fecha_creacion   = fechaHoyGlobal;
    registrarAjusteStock.hora_ajuste    = horaActualGlobal;   
    }, []);

    const listarResponsable= async() => {
        const response:any = await listarUsuarioPersona();
        if(response.success){
            setListaResponsable(response.data.objeto);
        }
    }

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

    const agregarProducto = (
        producto: ResultadoItem,
        unidad: any,
        cantidad: number,
        precio: number
        ) => {
        const nuevoItem = {
            tipo: producto.tipo,
            id: producto.id,
            producto: producto.nombre,
            unidad: unidad.con_descripcion,
            unidadCorrelativo: unidad.con_correlativo,
            cantidad,
            precio,
            total: cantidad * precio,
        };
        console.log("Nuevo item agregado:", nuevoItem);
        setDetalleAjusteStock((prev:any) => [...prev, nuevoItem]);
        setProductoSeleccionado(null);
    };

    const eliminarProducto = (index: number) => {
        setDetalleAjusteStock((prev) => prev.filter((_, i) => i !== index));
    };

    const validarCampos = () => {
        const nuevosErrores = {
            tipoAjuste: !tipoAjuste,
            responsable: !responsable,
            descripcion: !(registrarAjusteStock.descripcion?.trim() ?? ""),
        };
        setErrores(nuevosErrores);
        return !Object.values(nuevosErrores).some((e) => e);
    };

    const guardarAjusteStock = async () => {
        if(detalleAjusteStock.length === 0){
            showToast("Debe agregar al menos un producto o insumo al ajuste de stock.", 3000, "warning");
            return;
        }
        const nuevoRegistro = { ...registrarAjusteStock }; // Clonamos para evitar mutaciones directas
        nuevoRegistro.detalleAjusteStock = detalleAjusteStock.map(element => {
            const detalle = new DetalleAjusteStockClass();
            detalle.producto_presentacion_id    = null;
            detalle.insumo_id                   = null;
            if (element.tipo === "presentacion") {
                detalle.producto_presentacion_id = element.id;
            } else if (element.tipo === "insumo") {
                detalle.insumo_id = element.id;
            }
            detalle.cantidad        = element.cantidad;
            detalle.precio_unitario = element.precio;
            return detalle;
        });
        setCargando(true);
        try {
            setRegistroAjusteStock(nuevoRegistro);
            if (nuevoRegistro.id === 0) {
                delete nuevoRegistro.id, nuevoRegistro.fecha_creacion, nuevoRegistro.hora_creacion ;
            }
            const response:any = await registrarAjusteStockHooks(nuevoRegistro);
            console.log("response", response);
            if(response.success){
                setMostrarModalExito(true);
            }else{
                showToast(response.descripcion, 3000, "warning");
            }
        } catch (error) {
            
        } finally {
            setCargando(false);
        }

    }

    return (
        <div className='background-home-principal'>
            {ToastComponent}
            {LoadingComponent}
            <div>
                <div >
                <div>
                    <h1 style={{textAlign: 'center', fontWeight: 'bold'}}>REGISTRAR AJUSTE DE STOCK </h1>
                </div>
                    
                </div>
                <IonGrid>
                    <IonRow>
                        <IonCol size="12" sizeMd='4'>
                            <IonCard>
                                <IonCardHeader>
                                    <IonCardTitle>Datos generales</IonCardTitle>
                                </IonCardHeader>

                                <IonCardContent>
                                    <IonItem
                                        lines="inset"
                                        className={errores.tipoAjuste ? "input-error" : ""}
                                    >
                                        <IonLabel position="stacked">Tipo de Ajuste</IonLabel>
                                        <IonSelect
                                            value={tipoAjuste}
                                            onIonChange={(e) => {
                                                setTipoAjuste(Number(e.detail.value))
                                                setRegistroAjusteStock({...registrarAjusteStock,tipo_ajuste: e.detail.value});
                                            }
                                        }
                                        >
                                        <IonSelectOption value="" disabled>
                                            Seleccionar
                                        </IonSelectOption>
                                        {listaTipoAjuste
                                            .filter((item) => item.con_correlativo !== 0)
                                            .map((item) => (
                                            <IonSelectOption
                                                key={item.con_correlativo}
                                                value={item.con_correlativo}
                                            >
                                                {item.con_descripcion}
                                            </IonSelectOption>
                                            ))}
                                        </IonSelect>
                                    </IonItem>
                                    <IonItem
                                        lines="inset"
                                        className={errores.responsable ? "input-error" : ""}
                                    >
                                        <IonLabel position="stacked">Responsable</IonLabel>
                                        <IonSelect
                                            value={responsable}
                                            onIonChange={(e) => {
                                                setResponsable(Number(e.detail.value))
                                                setRegistroAjusteStock({...registrarAjusteStock,responsable_id: e.detail.value});
                                                }
                                            }
                                        >
                                        <IonSelectOption value="" disabled>
                                            Seleccionar
                                        </IonSelectOption>
                                        {listaResponsable
                                            .map((item) => (
                                            <IonSelectOption
                                                key={item.id}
                                                value={item.id}
                                            >
                                                {item.persona.nombre}
                                            </IonSelectOption>
                                            ))}
                                        </IonSelect>
                                    </IonItem>
                                    <IonItem
                                        lines="inset"
                                        className={errores.descripcion ? "input-error" : ""}
                                    >
                                        <IonLabel position="stacked">Descripción</IonLabel>
                                        <IonTextarea
                                            value={registrarAjusteStock.descripcion}
                                            maxlength={255}
                                            onIonChange={(e) => {
                                                setRegistroAjusteStock({
                                                    ...registrarAjusteStock,
                                                    descripcion: e.detail.value ?? ""
                                                });
                                                }
                                            }
                                        />
                                    </IonItem>
                                </IonCardContent>
                            </IonCard>
                        </IonCol>
                        <IonCol size="12" sizeMd='8'>
                            <IonCard>
                                <IonCardHeader>
                                        <IonCardTitle>Detalle</IonCardTitle>
                                        <IonCardSubtitle>Búsqueda del producto o insumo</IonCardSubtitle>
                                     </IonCardHeader>
                                     <IonCardContent>
                                    
                                        <Buscador
                                            buscar={buscarProductos}
                                            placeholder="Buscar nombre producto o insumo"
                                            onSeleccionar={(item) => {
                                            setProductoSeleccionado(item);
                                            }}
                                        />
                                        <ProductoSeleccionado
                                            producto={productoSeleccionado}
                                            unidadesMedida={unidadesMedida}
                                            onAgregar={agregarProducto}
                                            onCancelar={() => setProductoSeleccionado(null)}
                                        />

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
                                                    <IonCol size="2">Unidad</IonCol>
                                                    <IonCol size="2">Cantidad</IonCol>
                                                    <IonCol size="2">Precio</IonCol>
                                                    {/* <IonCol size="2">Total</IonCol> */}
                                                    <IonCol size="1">Acción</IonCol> {/* Nueva columna */}
                                                </IonRow>
                                                <div
                                                    style={{
                                                    marginTop: "5px",
                                                    maxHeight: "250px",
                                                    overflowY: "auto",
                                                    }}
                                                >
                                                    {detalleAjusteStock.map((item, i) => (
                                                    <IonRow
                                                        key={i}
                                                        style={{
                                                        borderBottom: "1px solid #e0e0e0",
                                                        alignItems: "",
                                                        padding: "8px 0",
                                                        }}
                                                    >
                                                        <IonCol>{item.producto}</IonCol>
                                                        <IonCol size="2" 
                                                        >
                                                        {item.unidad}
                                                        </IonCol>
                                                        <IonCol size="2" >
                                                        {item.cantidad}
                                                        </IonCol>
                                                        <IonCol size="2" >
                                                        S/ {item.precio.toFixed(2)}
                                                        </IonCol>
                                                        {/* <IonCol size="2" style={{ textAlign: "center" }}>
                                                        {item.total.toFixed(2)}
                                                        </IonCol> */}
                                                        <IonCol size="1" style={{ textAlign: "center" }}>
                                                        <IonButton
                                                            color="danger"
                                                            size="small"
                                                            onClick={() => eliminarProducto(i)}
                                                        >
                                                            <IonIcon icon={trash} />
                                                        </IonButton>
                                                        </IonCol>
                                                    </IonRow>
                                                    ))}
                                                </div>
                                            </IonGrid>
                                        </div>

                                        <IonButton
                                            expand="block"
                                            color="success"
                                            style={{ marginTop: "15px" }}
                                            onClick={() => {
                                            if (validarCampos()) {
                                                guardarAjusteStock();
                                            }
                                            }}
                                        >
                                            {cargando ? <IonSpinner name="crescent" /> : "Registrar ajuste stock"}
                                        </IonButton>

                                        <IonAlert
                                            isOpen={mostrarModalExito}
                                            onDidDismiss={() => {
                                                setMostrarModalExito(false);
                                                router.push(
                                                values.rutas.rutas.homePrincipal.rutaPrincipal +
                                                    values.rutas.rutas.homePrincipal.ajuste_stock.lista,
                                                "forward"
                                                );
                                            }}
                                            header="Éxito"
                                            message="El ajuste se registró correctamente."
                                            buttons={["OK"]}
                                        />
                                    
                                </IonCardContent>
                            </IonCard>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </div>
        </div>
    )
}

export default nuevoAjusteStock;