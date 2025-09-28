import React from 'react';
import { Trash2 } from 'lucide-react';

const ExpenseDisplayCard = ({ isAnyExpenseMutating, expense, deleteExpenseHandler }) => {
  return (
    <div className="flex justify-between">
      <div className="p-2">
        {/* Description */}
        <div className="text-sm mb-1 font-semibold font-mon mr-2 whitespace-pre-wrap ">
          {expense.description || 'No description'}
        </div>

        {/* Ammount Section */}
        <div className="pt-2">
          <div
            className={`text-sm md:text-lg font-semibold ${
              expense?.isExpense ? 'text-red-400' : 'text-emerald-400'
            } wrap-anywhere whitespace-nowrap`}
          >
            {expense?.isExpense
              ? '-₹' + expense.amount.toFixed(2)
              : '+₹' + expense.amount.toFixed(2)}
          </div>
        </div>
      </div>

      {/* delete expense */}
      <button
        onClick={() => deleteExpenseHandler(expense?.id)}
        disabled={isAnyExpenseMutating}
        className="rounded-full p-2 text-neutral-500 hover:text-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
};

export default ExpenseDisplayCard;
