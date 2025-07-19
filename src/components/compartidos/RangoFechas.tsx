import React, { useEffect } from 'react'
import { DateRange } from 'react-date-range';

import format from 'date-fns/format';
import { addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import './RangoFechas.css'; // Import your custom styles

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { IonInput } from '@ionic/react';

interface RangoFechasProps {
  onChange: (range: { startDate: string; endDate: string }) => void; // ⬅️ ahora devuelve strings
  fechaHoy?: string; // opcional
  fechaInicio?: string; // opcional
  fechaFin?: string; // opcional
  meses: number; // opcional, para definir cuántos meses mostrar
}

const RangoFechas: React.FC<RangoFechasProps> = ({ onChange, fechaHoy, fechaInicio, fechaFin, meses  }) => {
  const [range, setRange] = React.useState([
    {
      startDate: new Date(`${fechaInicio!}T00:00:00`),
      endDate: new Date(`${fechaFin!}T00:00:00`),
      key: 'selection',
    },
  ]);

  const [open, setOpen] = React.useState(false);
  const refOne = React.useRef<HTMLDivElement>(null);

  const hideOnEscape = (e: any) => {
    if (e.key === 'Escape') setOpen(false);
  };

  const hideOnClickOutside = (e: any) => {
    if (refOne.current && !refOne.current.contains(e.target)) setOpen(false);
  };

  useEffect(() => {
    console.log("rango", fechaFin);
    document.removeEventListener('keydown', hideOnEscape, true);
    document.removeEventListener('click', hideOnClickOutside, true);
  }, []);

  const primaryColor = getComputedStyle(document.documentElement)
  .getPropertyValue('--ion-color-primary')
  .trim();

  return (
    <div className='calendarWrap'>
      <IonInput
        type='text'
        value={`${format(range[0].startDate, 'dd/MM/yyyy')} al ${format(range[0].endDate, 'dd/MM/yyyy')}`}
        
        onClick={() => {
          setOpen(!open);
          document.addEventListener('keydown', hideOnEscape, true);
          document.addEventListener('click', hideOnClickOutside, true);
        }}
        className='inputCalendar'
      />

      <div ref={refOne}>
        {open && (
          <DateRange
            editableDateInputs={true}
            onChange={(item) => {
              const { startDate, endDate, key } = item.selection;
              const newRange = [{
                startDate: startDate ?? new Date(),
                endDate: endDate ?? new Date(),
                key: key ?? 'selection'
              }];
              setRange(newRange);
              // Aquí se notifica al componente padre
              // Formatear fechas como 'YYYY-MM-DD'
              const formattedStart = format(newRange[0].startDate, 'yyyy-MM-dd');
              const formattedEnd = format(newRange[0].endDate, 'yyyy-MM-dd');
              // Pasar las fechas formateadas al padre
              onChange({
                startDate: formattedStart,
                endDate: formattedEnd
              });
            }}
            moveRangeOnFirstSelection={false}
            ranges={range}  
            className='dateRange'
            rangeColors={[primaryColor]}
            months={meses || 1}
            direction='horizontal'
            locale={es}
            maxDate={new Date(`${fechaHoy!}T00:00:00`)}
          />
        )}
      </div>
    </div>
  );
};

export default RangoFechas;