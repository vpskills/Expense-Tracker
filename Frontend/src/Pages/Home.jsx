import React, { useState } from 'react';
import Calendar from '../components/Calendar';
import AddExpenses from '../components/AddExpenses';
import ListExpenses from '../components/ListExpenses';

const Home = () => {
  const [expensesAdded, setExpensesAdded] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="flex justify-center gap-3 text-gray-400 w-7xl mx-auto p-4 h-svh">
      <div className='flex-1 flex justify-between flex-col h-full'>
        <Calendar
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
        <AddExpenses selectedDate={selectedDate} setExpensesAdded={setExpensesAdded} />
      </div>
      <div className='flex-1 h-full border border-neutral-700 bg-neutral-950 rounded-2xl'>
        <ListExpenses selectedDate={selectedDate} expensesAdded={expensesAdded}/>
      </div>
    </div>
  );
};

export default Home;
