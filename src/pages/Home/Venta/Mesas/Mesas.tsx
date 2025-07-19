import React, { useEffect, useState } from "react";
import { IonButton, IonChip, IonIcon, IonItem, IonLabel, IonSegment, IonSegmentButton, useIonRouter } from '@ionic/react';
import './Mesas.css';
import { hourglass, image } from 'ionicons/icons';
import { personOutline } from 'ionicons/icons';
import mesaVacia from '../../../../assets/img/mesa vacia.png';
import mesaOcupada from '../../../../assets/img/mesa ocupada.png';
import { useVenta } from "../../../../hooks/useVenta";
import ReusableModal from "../../../../components/compartidos/ReusableModal";
import { MESAS_GET, MESAS_LISTA_KEYS, PISO_KEYS, PISOS_KEYS, SEPARAR_MESA_POST } from "../../../../models/clases/config";
import useToast from "../../../../hooks/alertMessage/useToast";
import values from "../../../../models/clases/values";
import { MesasClass } from "../../../../models/clases/Mesas";
import socket from "../../../../sockets/socket";
import { useSocketEvent } from "../../../../hooks/useSocketEvent";
import { SOCKET_EVENTS } from "../../../../models/clases/socketEvents";

const Mesas: React.FC = () => {
  const { obtenerPisos,obtenerMesas,separaMesas, loading, error,LoadingComponent } = useVenta();
  const [pisos, setPisos] = useState<any>([
    {id:1, descripcion: 'Primer piso', mesas: [
      {id: 1, descripcion: 'Mesa 1', colorFondo: 'white',colorTexto: 'black', estado: 0},
      {id: 2, descripcion: 'Mesa 2', colorFondo: '#b20100',colorTexto: 'white', estado:1},
      {id: 3, descripcion: 'Mesa 3', colorFondo: 'white',colorTexto: 'black', estado: 0},
      {id: 4, descripcion: 'Mesa 4', colorFondo: '#1e8dc7',colorTexto: 'white', estado: 0},
      {id: 5, descripcion: 'Mesa 5', colorFondo: '#1e8dc7',colorTexto: 'white', estado: 0},
      {id: 6, descripcion: 'Mesa 6', colorFondo: 'white',colorTexto: 'black', estado: 0},
      {id: 7, descripcion: 'Mesa 7', colorFondo: '#b20100',colorTexto: 'white',estado:1},
    ]},
    {id:2, descripcion: 'Segundo piso', mesas: [{id: 1, descripcion: 'Mesa 1'}]},
    {id:3, descripcion: 'Tercer piso', mesas: [{id: 1, descripcion: 'Mesa 1'}]}
  ]);
  const [selectedSegment, setSelectedSegment] = useState<any>(pisos[0]?.id.toString());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [datosPisos, setDatosPisos] = useState<any>();
  const [mesas, setMesas] = useState<MesasClass[]>([]);
  const [mesaSeparada, setMesaSeparada] = useState<any>({});
  const [count, setCount] = useState(1);
  const { showToast, ToastComponent } = useToast();
  const router = useIonRouter();


  useEffect(() => {
    obtenerPisosLista();
  }, []);

   useSocketEvent(SOCKET_EVENTS.PEDIDO_ACTUALIZADO_MESA, (data) => {
    consultarMesas(selectedSegment);
  });

  const obtenerPisosLista = async () => {
    const response:any = await obtenerPisos();
    if(response.success){
      const datosMapeados = {
        mesasLibres: response.data.objeto[PISOS_KEYS.MESAS_LIBRES],
        mesasOcupadas: response.data.objeto[PISOS_KEYS.MESAS_OCUPADAS],
        mesasProcesoPago: response.data.objeto[PISOS_KEYS.MESAS_PROCESO],
        pisos: response.data.objeto[PISOS_KEYS.PISOS]?.map((piso: any) => ({
          id: piso[PISO_KEYS.ID],
          descripcion: piso[PISO_KEYS.DESCRIPCION],
          impresora: piso[PISO_KEYS.IMPRESORA],
        })) || [],
      };
      setDatosPisos(datosMapeados);
      consultarMesas(datosMapeados.pisos[0]["id"]);
    }else{
      setDatosPisos(null);
    }

  }

  const handleConfirm = async (data: any) => {
    if(count <= 0){
      showToast("El número de personas no puede ser menor o igual a 0", 3000, 'warning');
      return;
    }
    // setTimeout(() => {
    //   router.push(values.rutas.rutas.homePrincipal.rutaPrincipal + values.rutas.rutas.homePrincipal.pedido + "/0"+"/"+mesaSeparada.id, "forward");
    // }, 1000);
    const response:any = await separaMesas({[SEPARAR_MESA_POST.idMesa]:mesaSeparada.id, [SEPARAR_MESA_POST.numPersonas]:count}, true);
    if(response.success) {
      showToast(response.data.descripcion, 3000, "success");
      setTimeout(() => {
        setIsModalOpen(false);
        consultarMesas(selectedSegment);
        router.push(values.rutas.rutas.homePrincipal.rutaPrincipal + values.rutas.rutas.homePrincipal.pedido + "/0"+"/"+mesaSeparada.id, "forward");
      }, 1000);
    }else{
      showToast("Error al separar mesa");
    }
  };

  const consultarMesas = async (piso:any) => {
    setMesas([]);
    const response:any = await obtenerMesas({[MESAS_GET.ID]:piso});
    console.log(response);
    
    setMesas(response.data.objeto);
  }

  const obtenerEstilosMesa = (estado: number) => {
    switch (estado) {
      case 1:
        return { colorFondo: "white", colorTexto: "black", estado: 0, imagen:mesaVacia};
      case 2:
        return { colorFondo: "#b20100", colorTexto: "white", estado: 2, imagen: mesaOcupada };
      case 3:
        return { colorFondo: "#1e8dc7", colorTexto: "white", estado: 3, imagen: mesaOcupada  };
      default:
        return { colorFondo: "gray", colorTexto: "white", estado: -1, imagen: mesaOcupada };
    }
  };

  const separarMesa = (mesa:MesasClass) => {
    let pedido = mesa.pedido_id == null || mesa.pedido_id == 0 ? 0 : mesa.pedido_id;
    let piso =  datosPisos.pisos.find((elementos:any) => elementos.id == selectedSegment)
    mesa.descripcion_piso = piso.descripcion;
    setMesaSeparada(mesa);
    if(mesa.estado == 1){
      setIsModalOpen(true);
    }else{
      router.push(values.rutas.rutas.homePrincipal.rutaPrincipal + values.rutas.rutas.homePrincipal.pedido + "/"+pedido+"/"+mesa.id, "forward");
    }
  }

  function tiempoTranscurrido(horaPedido: string): string {
    const ahora = new Date();
    
    // Convertimos horaPedido ("HH:mm:ss") al mismo día
    const [h, m, s] = horaPedido.split(':').map(Number);
    const horaPedidoDate = new Date(
      ahora.getFullYear(),
      ahora.getMonth(),
      ahora.getDate(),
      h,
      m,
      s
    );

    // Si la hora del pedido es en el futuro (posible error de zona horaria), restamos un día
    if (horaPedidoDate > ahora) {
      horaPedidoDate.setDate(horaPedidoDate.getDate() - 1);
    }

    const diffMs = ahora.getTime() - horaPedidoDate.getTime();
    const diffMin = Math.floor(diffMs / 60000); // ms → minutos

    if (diffMin < 60) {
      return `${diffMin} min`;
    }

    const horas = Math.floor(diffMin / 60);
    const minutos = diffMin % 60;
    return `${horas}h ${minutos}m`;
  }


  return (
    <>
    {LoadingComponent}
    {ToastComponent}
    {
      datosPisos != null ?(
        <>
          <div className="div-mesas"> 
              <div>
                  <div>
                      <IonChip outline={true} className="ion-chip fadeInDown">{datosPisos.mesasLibres} mesas libres</IonChip>
                  </div>
                  <div>
                      <IonChip outline={true} className="ion-chip ion-chip-proceso fadeInDown">{datosPisos.mesasProcesoPago} en proceso de pago</IonChip>
                  </div>
                  <div>
                      <IonChip outline={true} className="ion-chip ion-chip-ocupado fadeInDown">{datosPisos.mesasOcupadas} mesas ocupadas</IonChip>
                  </div>
              </div>
              <div>
                
              </div>
          </div>
          <div>
            <IonSegment
                className="segment-mesas fadeInDown"
                mode="md"
                value={selectedSegment}
                onIonChange={(e) => {
                  setSelectedSegment(e.detail.value)
                  consultarMesas(e.detail.value)
                }}
              >
                {datosPisos.pisos.map((piso:any) => (
                  <IonSegmentButton  key={piso.id} value={piso.id.toString()} className="segment-button-mesas">
                    <IonLabel>{piso.descripcion.toUpperCase()}</IonLabel>
                  </IonSegmentButton>
                ))}
            </IonSegment>
              <div>
                {pisos.map((piso:any) =>
                  selectedSegment === piso.id.toString() ? (
                    <div key={piso.id} className="mesas-container">
                      <div className="mesas-grid fadeInDown"   >
                        {mesas.map((mesa:any) => {
                          const estilos = obtenerEstilosMesa(mesa.estado);
                          return (
                            <div key={mesa.id} className="mesa " onClick={() => separarMesa(mesa)}  style={{background: estilos.colorFondo}}>
                              <div>
                                <span className="titulo-mesa" style={{color: estilos.colorTexto}}>{mesa.descripcion} </span>
                              </div>
                              <div>
                                {mesa.estado !== 1 && (
                                  <span className="hora-mesa" style={{ color: estilos.colorTexto }}>
                                    <IonIcon icon={hourglass} className="icon-tiempo" /> {tiempoTranscurrido(mesa.horaPedido)}
                                  </span>                            
                                )}

                                </div>
                              <div>
                                  {
                                    mesa.estado == 0 ? (
                                      <img className="vacia-mesa" src={estilos.imagen} alt="" />
                                    ): 
                                    <img className="vacia-mesa" src={estilos.imagen} alt="" />
                                  }
                                </div>
                                <div>
                                  <div>
                                    <span className="hora-mesa item-mesa" style={{color: estilos.colorTexto}}> {mesa.items} Items</span>
                                    <span className="hora-mesa" style={{color: estilos.colorTexto}}> 
                                      <IonIcon 
                                        icon={personOutline} 
                                        className="icon-tiempo"
                                      /> {mesa.cantidadPersonas}</span>
                                  </div>
                              </div>
                            </div>
                          )

                          })}
                        </div>

                    </div>
                  ) : null
                )}
              </div>
          </div>
          
          <ReusableModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleConfirm}
            title=""
            cancelText="Cerrar"
            confirmText="Guardar"
            classN="modal-separar-mesa"
          >
            <div className="div-principal-separar-mesas">
              <div className="div-separar-mesas">
                <h1>Necesitamos de tu confirmación</h1>
              </div>
              <div className="div-separar-mesas">
                <label>Se procederá a aperturar la siguiente mesa</label>
              </div>
              <IonItem>
              </IonItem>
              <IonItem>
                <IonLabel>Salon:</IonLabel>
                <IonLabel slot="end">{mesaSeparada.descripcion_piso}</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>Mesa:</IonLabel>
                <IonLabel slot="end">{mesaSeparada.descripcion}</IonLabel>
              </IonItem>

              <div className="div-n-personas">
                <label>Nro de personas </label>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <IonButton onClick={() => setCount(count - 1)} disabled={count === 1}>-</IonButton>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={count}
                  onChange={(e) => {
                    const value = e.target.value.trim();

                    // Permitir solo números enteros positivos
                    if (/^\d*$/.test(value)) {
                      const num = parseInt(value, 10);
                      if (!isNaN(num) && num >= 1) {
                        setCount(num);
                      } else if (value === "") {
                        setCount(1); // Si el campo queda vacío, restablecer a 1
                      }
                    }
                  }}
                  onBlur={(e) => {
                    const num = parseInt(e.target.value, 10);
                    if (isNaN(num) || num < 1) {
                      setCount(1);
                    }
                  }}
                  style={{
                    width: '60px',
                    textAlign: 'center',
                    fontSize: '16px',
                    padding: '4px 8px',
                    border: '1px solid #ccc',
                    borderRadius: '6px',
                  }}
                />
                <IonButton onClick={() => setCount(count + 1)}>+</IonButton>
              </div>
            </div>
          </ReusableModal>
        </>
      ): 
      <></>
    }
    </>
  );
};

export default Mesas;