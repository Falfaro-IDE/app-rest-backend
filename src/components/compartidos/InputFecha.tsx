import React, { useEffect } from 'react';

import format from 'date-fns/format';
import { addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import './RangoFechas.css'; // Import your custom styles

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { Calendar } from 'react-date-range';

interface FechasProps {
  onChange: (range: { fechaHoy: string}) => void; // ahora devuelve strings
  fechaHoy?: string; // opcional
}

const InputFecha : React.FC<FechasProps> = ({ onChange, fechaHoy  }) => {

    const [ fecha, setFecha ] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const refOne = React.useRef<HTMLDivElement>(null);

    const hideOnEscape = (e: any) => {
        if (e.key === 'Escape') setOpen(false);
    };

    const hideOnClickOutside = (e: any) => {
        if (refOne.current && !refOne.current.contains(e.target)) setOpen(false);
    };

    useEffect(() => {
        setFecha(format(new Date(`${fechaHoy!}T00:00:00`), 'yyyy-MM-dd'));
        document.removeEventListener('keydown', hideOnEscape, true);
        document.removeEventListener('click', hideOnClickOutside, true);
    }, []);

    const handleSelect = (date:any) => {
        setFecha(format(date, 'yyyy-MM-dd'));
    }

    const primaryColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--ion-color-primary')
    .trim();

    return (
        <div className='calendarWrap'>
            <input
                type='text'
                value={ fecha }
                readOnly
                className='inputCalendar'
                onClick={() => {
                    setOpen(!open);
                    document.addEventListener('keydown', hideOnEscape, true);
                    document.addEventListener('click', hideOnClickOutside, true);
                }}
            />
                <div ref={refOne}>
                    {
                        open && (
                                <Calendar
                                    locale={es}
                                    date={new Date(`${fecha!}T00:00:00`)}
                                    onChange={(item) => {
                                        handleSelect(item);
                                        onChange({
                                            fechaHoy: format(item, 'yyyy-MM-dd')
                                        });
                                        setOpen(false);
                                     }
                                    }
                                    maxDate={new Date(`${fechaHoy!}T00:00:00`)}
                                    direction="horizontal"
                                    className='dateRange'
                                    rangeColors={[primaryColor]}
                                />
                        )
                    }
                </div>

        </div>
    )
}

export default InputFecha