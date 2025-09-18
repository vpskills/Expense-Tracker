import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { isFutureDate } from '../utils';

const Calendar = ({ selectedDate, setSelectedDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

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
    <div className="bg-neutral-950 p-2 rounded-2xl">
      {/* Calendar Header */}
      <div className="flex justify-between items-center border border-neutral-700 rounded-xl p-2 bg-neutral-900 mx-auto">
        <button
          onClick={() => navigateMonth(-1)}
          className="bg-neutral-600 hover:bg-neutral-500 text-gray-400 p-2 rounded-lg font-semibold transition-all"
        >
          <ChevronLeft />
        </button>
        <h3 className="text-xl font-bold text-gray-400">
          {currentDate.toLocaleDateString("en", {
            month: "long",
            year: "numeric",
          })}
        </h3>
        <button
          onClick={() => navigateMonth(1)}
          className="bg-neutral-600 hover:bg-neutral-500 text-gray-400 p-2 rounded-lg font-semibold transition-all"
        >
          <ChevronRight />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 my-4 rounded-xl">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center font-semibold text-gray-300 p-3 text-lg rounded"
          >
            {day}
          </div>
        ))}
        {getDaysInMonth(currentDate).map((dayObj, index) => (
          <div
            key={index}
            onClick={() => !isFutureDate(dayObj) && setSelectedDate(new Date(dayObj.date))}
            className={`py-3 flex items-center justify-center rounded-lg font-medium transition-all duration-500 text-xl
            ${dayObj.isCurrentMonth ? 'bg-neutral-800 text-gray-400 hover:bg-gray-900' : 'bg-gray-950 text-gray-600 hover:bg-gray-900'}
            ${isDateSelected(new Date(dayObj.date)) ? 'bg-rose-500 text-white hover:bg-rose-500' : ''}
            ${dayObj.isToday && !isDateSelected(new Date(dayObj.date))? 'ring-2 ring-rose-700 bg-rose-950': ''}
            ${isFutureDate(dayObj)? 'bg-gray-800 text-gray-700 cursor-not-allowed': 'cursor-pointer'}
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
