import React, { useState } from 'react';
import Calendar from '../components/Calendar';
import AddExpenses from '../components/AddExpenses';
import ListExpenses from '../components/ListExpenses';
import { Plus } from 'lucide-react';
import { isToday } from '../utils';

const Home = () => {
  const [expensesAdded, setExpensesAdded] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formVisible, setFormVisible] = useState(false);

  return (
    <div className="relative md:static flex flex-col justify-center md:flex-row md:h-full md:max-w-7xl md:p-5 mx-auto md:gap-3 text-gray-400 overflow-auto custom-scroll">
      <div className="flex-0 md:flex-1 flex gap-1 flex-col h-full">
        <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        <div
          className={`${
            formVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
          } fixed inset-0 transition-all max-h-svh duration-300 backdrop-blur-xs flex justify-center items-center px-3 md:p-0 md:static md:opacity-100 md:scale-100 z-20`}
        >
          <AddExpenses selectedDate={selectedDate} setExpensesAdded={setExpensesAdded} setFormVisible={setFormVisible}/>
        </div>
      </div>

      <div className="flex-1 md:border border-neutral-800 bg-neutral-950 md:rounded-2xl">
        <ListExpenses selectedDate={selectedDate} expensesAdded={expensesAdded}/>
      </div>

      {isToday(selectedDate)&&<div
        onClick={() => setFormVisible(!formVisible)}
        className="flex md:hidden fixed bottom-0 inset-x-0 pb-4 justify-center items-center z-20"
      >
        <Plus
          size={35}
          className={`transition-all ${
            formVisible ? 'rotate-45 text-rose-500' : 'text-neutral-600'
          }`}
        />
      </div>}
    </div>
  );
};

export default Home;
