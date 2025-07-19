import React, { useEffect, useState } from "react";
import AperturaCaja from "./apertura";
import CierreCaja from "./cierre";
import { useAperturaCierreCaja } from "../../../hooks/useAperturaCierreCaja";
import useToast from "../../../hooks/alertMessage/useToast";

const AperturaCierreCaja: React.FC = () => {
  const { validarAperturaUsuario } = useAperturaCierreCaja();
  const { showToast, ToastComponent } = useToast();
  const [tieneApertura, setTieneApertura] = useState<boolean | null>(null);
  const [idApertura, setIdApertura] = useState<number | null>(null);

  useEffect(() => {
    const fetchValidacion = async () => {
      try {
        const res = await validarAperturaUsuario();

        if (res.data.objeto) {
          // El usuario tiene una caja aperturada
          setTieneApertura(true);
          setIdApertura(res.data.objeto.id);  // ← Guardamos el id recibido
            
        } else {
          // El usuario NO tiene una caja aperturada
          setTieneApertura(false);
          setIdApertura(null);
        }
      } catch (error) {
        showToast("Error al validar apertura", 3000, "danger");
        setTieneApertura(null);
        setIdApertura(null);
      }
    };

    fetchValidacion();
  }, []);

  return (
    <div>
      {ToastComponent}
      {tieneApertura === null && <p>Validando apertura...</p>}

      {tieneApertura === false && (
        <AperturaCaja
          onAperturaExitosa={(id) => {
            setTieneApertura(true);
            setIdApertura(id);
          }}
        />
      )}

      {tieneApertura === true && idApertura !== null && (
        <CierreCaja
          aperturaId={idApertura}
          onCierreExitosa={() => {
            setTieneApertura(false);
            setIdApertura(null);
          }}
        />
      )}
    </div>
  );
};

export default AperturaCierreCaja;
