import React from 'react';
import { formatCurrency, formatDisplayDate } from '../../utils';
import { isMobile } from 'react-device-detect';

const DisplayAllAmounts = ({ data, selectedDate }) => {
  function getTotalAmount() {
    const dayExpenses = data?.expenses || [];

    return dayExpenses.reduce(
      (acc, expense) => {
        if (expense?.isExpense) {
          acc.total -= expense.amount;
          acc.expense += expense.amount;
        } else {
          acc.total += expense.amount;
          acc.income += expense.amount;
        }
        return acc;
      },
      { total: 0, expense: 0, income: 0 }
    );
  }
  return (
    <div className="md:p-0 md:mb-6 p-3">
      <div className="flex flex-col gap-3 md:gap-2 border border-blue-200 dark:border-neutral-800 rounded-md p-4 bg-blue-100 dark:bg-neutral-900 overflow-x-auto mb-2">
        <div className="flex justify-between text-neutral-600 font-semibold dark:text-neutral-400">
          <span className="text-sm md:text-lg">Income</span>
          <span className="text-emerald-500 text-sm font-semibold md:text-lg">
            {formatCurrency(getTotalAmount().income, true)}
          </span>
        </div>
        <div className="flex justify-between text-neutral-600 font-semibold dark:text-neutral-400">
          <span className="text-sm md:text-lg">Spent</span>
          <span className="text-red-400 text-sm font-semibold md:text-lg">
            {getTotalAmount().expense > 0 && '-'}
            {formatCurrency(getTotalAmount().expense, false)}
          </span>
        </div>
        <div className="flex justify-between text-neutral-600 font-semibold dark:text-neutral-400">
          <span className="text-sm md:text-lg">Total</span>
          <span className="text-sm font-semibold md:text-lg">
            {formatCurrency(getTotalAmount().total, true)}
          </span>
        </div>
      </div>
      {!isMobile && (
        <div className="text-sm md:text-md text-neutral-500 font-semibold p-2">
          {formatDisplayDate(selectedDate)}
        </div>
      )}
    </div>
  );
};

export default DisplayAllAmounts;
