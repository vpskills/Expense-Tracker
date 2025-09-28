import React from 'react';

const NoExpenseBanner = () => {
  return (
    <div className="text-center flex items-center flex-col justify-center h-[70%] text-gray-500 py-12 italic">
      <div className="text-4xl mb-4">📝</div>
      No expenses recorded for this date
    </div>
  );
};

export default NoExpenseBanner;
