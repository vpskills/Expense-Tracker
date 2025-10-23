import { useState } from 'react';
import CalendarSwitchButton from './CalendarSwitchButton';
import { useGlobalContext } from '../GlobalContext';

const CalenderTypeSwitch = () => {
  const { calenderType, setCalendarType } = useGlobalContext();

  return (
    <div className="flex gap-5 py-1 px-5 justify-around">
      <CalendarSwitchButton
        onClick={() => setCalendarType(1)}
        className={`border-cyan-700 bg-cyan-950 opacity-70 text-cyan-200 ${
          calenderType === 1 && 'opacity-100 font-semibold border-cyan-500'
        }`}
      >
        Daily
      </CalendarSwitchButton>

      <CalendarSwitchButton
        onClick={() => setCalendarType(2)}
        className={`border-amber-700 bg-amber-950 opacity-70 text-amber-200 ${
          calenderType === 2 && 'opacity-100 font-semibold border-amber-500'
        }`}
      >
        Monthly
      </CalendarSwitchButton>

      <CalendarSwitchButton
        onClick={() => setCalendarType(3)}
        className={`border-emerald-700 bg-emerald-950 opacity-70 text-emerald-200 ${
          calenderType === 3 && 'opacity-100 font-semibold border-emerald-500'
        }`}
      >
        Yearly
      </CalendarSwitchButton>
    </div>
  );
};

export default CalenderTypeSwitch;
