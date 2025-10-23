import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { isCurrentMonth, isCurrentYear, isFutureDate, isToday } from '../utils';
import { isMobile } from 'react-device-detect';
import { useGlobalContext } from './GlobalContext';

const Calendar = ({ selectedDate, setSelectedDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [openCalender, setOpenCalender] = useState(false);
  const { calenderType } = useGlobalContext();

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
    setSelectedDate(newDate);
  };

  const navigateDate = (direction) => {
    const newDate = new Date(selectedDate || currentDate);
    newDate.setDate(newDate.getDate() + direction);
    setCurrentDate(newDate);
    setSelectedDate(newDate);
  };

  const navigateYear = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(newDate.getFullYear() + direction);
    setCurrentDate(newDate);
    setSelectedDate(newDate);
  };

  const handlePrevClick = () => {
    if (isMobile) {
      if (calenderType === 1) {
        navigateDate(-1);
      } else if (calenderType === 2) {
        navigateMonth(-1);
      } else if (calenderType === 3) {
        navigateYear(-1);
      }
    } else {
      navigateMonth(-1);
    }
  };

  const handleNextClick = () => {
    if (isMobile) {
      if (calenderType === 1) {
        navigateDate(1);
      } else if (calenderType === 2) {
        navigateMonth(1);
      } else if (calenderType === 3) {
        navigateYear(1);
      }
    } else {
      navigateMonth(1);
    }
  };

  const isNextDisabled =
    (calenderType === 1 && isToday(selectedDate)) ||
    (calenderType === 2 && isCurrentMonth(selectedDate)) ||
    (calenderType === 3 && isCurrentYear(selectedDate));

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];

    // prev month days
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      days.push({
        day,
        date: new Date(year, month - 1, day),
        isCurrentMonth: false,
        isToday: false,
      });
    }

    // current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const today = new Date();
      days.push({
        day,
        date,
        isCurrentMonth: true,
        isToday: date.toDateString() === today.toDateString(),
      });
    }

    // Next month days to fill grid
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        date: new Date(year, month + 1, day),
        isCurrentMonth: false,
        isToday: false,
      });
    }

    return days;
  };

  const isDateSelected = (date) => {
    return date.getTime() === selectedDate.getTime();
  };

  return (
    <div className="dark:bg-neutral-950 p-2 md:rounded-2xl md:border border-neutral-800">
      {/* Calendar Header */}
      <div className="flex justify-between items-center border border-blue-200 dark:border-neutral-800 rounded-xl p-2 bg-blue-100 dark:bg-neutral-900 mx-auto">
        <button
          onClick={handlePrevClick}
          className="bg-blue-200 dark:bg-neutral-800 hover:bg-neutral-700 text-blue-600 dark:text-gray-400 p-2 rounded-lg font-semibold transition-all"
        >
          <ChevronLeft />
        </button>
        <h3
          onClick={() => setOpenCalender(!openCalender)}
          className="md:text-xl font-bold text-black dark:text-gray-400"
        >
          {calenderType === 1 &&
            selectedDate.toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          {calenderType === 2 &&
            selectedDate.toLocaleDateString('en-GB', {
              month: 'long',
              year: 'numeric',
            })}
          {calenderType === 3 &&
            selectedDate.toLocaleDateString('en-GB', {
              year: 'numeric',
            })}
        </h3>
        <button
          disabled={isNextDisabled}
          onClick={handleNextClick}
          className={`bg-blue-200 dark:bg-neutral-800 ${
            isNextDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-neutral-700'
          } text-blue-600 dark:text-gray-400 p-2 rounded-lg font-semibold transition-all`}
        >
          <ChevronRight />
        </button>
      </div>

      {/* Calendar Grid */}
      <div
        className={`${
          isMobile &&
          (openCalender
            ? 'absolute z-50 scale-95 dark:border border-neutral-700 inset-x-0 top-12 bg-blue-50 dark:bg-neutral-950 p-5'
            : 'hidden')
        } grid grid-cols-7 gap-2 my-4 rounded-xl`}
      >
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center font-semibold text-blue-950 dark:text-gray-300 p-3 text-lg rounded">
            {day}
          </div>
        ))}
        {getDaysInMonth(currentDate).map((dayObj, index) => (
          <div
            key={index}
            onClick={() => {
              !isFutureDate(dayObj) && setSelectedDate(new Date(dayObj.date));
              isMobile && !isFutureDate(dayObj) && setOpenCalender(false);
            }}
            className={`py-[7px] md:py-3 border dark:border-neutral-800 flex items-center justify-center rounded-full md:rounded-lg font-medium transition-all duration-500 text-xl
            ${
              dayObj.isCurrentMonth
                ? 'bg-blue-200 text-blue-950 border-0 dark:bg-neutral-900 dark:text-gray-400 hover:bg-neutral-800'
                : 'text-gray-600 hover:bg-gray-900'
            }
            ${
              isDateSelected(new Date(dayObj.date))
                ? 'bg-rose-500 text-white hover:bg-rose-500'
                : ''
            }
            ${
              dayObj.isToday && !isDateSelected(new Date(dayObj.date))
                ? 'ring-2 ring-blue-700 bg-blue-400 dark:ring-rose-700 dark:bg-rose-950'
                : ''
            }
            ${isFutureDate(dayObj) ? 'cursor-not-allowed' : 'cursor-pointer'}
          `}
          >
            {dayObj.day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
