import { format, addDays } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const timeZone = 'America/Lima';

export function obtenerFechasPeruanas(diasRestar: number = 7) {
  const ahora = new Date();

  const fechaPeru = toZonedTime(ahora, timeZone);
  const inicioPeru = toZonedTime(addDays(ahora, -diasRestar), timeZone);

  return {
    fechaInicioGlobal: format(inicioPeru, 'yyyy-MM-dd'),
    fechaFinGlobal: format(fechaPeru, 'yyyy-MM-dd'),
    fechaHoyGlobal: format(fechaPeru, 'yyyy-MM-dd'),
    horaActualGlobal: format(fechaPeru, 'HH:mm:ss') // ← Aquí está la hora
  };
}