import React, { useState } from 'react';
import Calendar from '../components/Calendar';
import AddExpenses from '../components/AddExpenses';

const Home = () => {
  const [expenses, setExpenses] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="text-gray-400 w-[80%] mx-auto">
      <Calendar
        expenses={expenses}
        setExpenses={setExpenses}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <AddExpenses selectedDate={selectedDate} setExpenses={setExpenses} expenses={expenses} />
    </div>
  );
};

export default Home;
