import React, { useState } from 'react';
import Calendar from '../components/Calendar';
import AddExpenses from '../components/AddExpenses';
import ListExpenses from '../components/ListExpenses/ListExpenses';
import { useGlobalContext } from '../components/GlobalContext';
import CalenderTypeSwitch from '../components/CalendarSwitch/CalenderTypeSwitch';
import MonthlyExpenseView from '../components/ListExpenses/MonthlyView';
import YearExpenseView from '../components/ListExpenses/YearlyView';

const Home = () => {
  const [expensesAdded, setExpensesAdded] = useState(false);
  const { formVisible, setFormVisible, selectedDate, setSelectedDate } = useGlobalContext();
  const { calenderType } = useGlobalContext();

  return (
    <div className="relative md:static flex flex-col justify-center md:flex-row md:h-full md:max-w-7xl md:p-5 mx-auto md:gap-3 text-gray-400 overflow-auto custom-scroll">
      <div className="flex-0 md:flex-1 flex gap-1 flex-col h-full">
        <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        <div
          className={`${
            formVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
          } fixed inset-0 transition-all max-h-svh duration-300 backdrop-blur-xs flex justify-center items-center px-3 md:p-0 md:static md:opacity-100 md:scale-100 z-20`}
        >
          <AddExpenses
            selectedDate={selectedDate}
            setExpensesAdded={setExpensesAdded}
            setFormVisible={setFormVisible}
          />
        </div>
      </div>

      <div className="block md:hidden">
        <CalenderTypeSwitch />
      </div>

      <div className="flex-1 md:border border-neutral-800 dark:bg-neutral-950 md:rounded-2xl">
        {calenderType === 1 ? (
          <ListExpenses selectedDate={selectedDate} expensesAdded={expensesAdded} />
        ) : calenderType === 2 ? (
          <MonthlyExpenseView selectedDate={selectedDate} />
        ) : (
          <YearExpenseView selectedDate={selectedDate}/>
        )}
      </div>
    </div>
  );
};

export default Home;
