import { useQuery } from '@tanstack/react-query';
import { fetchExpensesByDate } from '../store/actions/expenses.actions';
import CustomLoader from './CustomLoader';
import { useEffect } from 'react';

const ListExpenses = ({ selectedDate, expensesAdded }) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['expenses', selectedDate],
    queryFn: () => fetchExpensesByDate(selectedDate),
    enabled: !!selectedDate,
  });

  useEffect(() => {
    if (expensesAdded) {
      refetch();
    }
  }, [expensesAdded, refetch]);

  function getTotalAmount() {
    const dayExpenses = data?.expenses || [];
    return dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  }

  function formatDisplayDate(date) {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  if (isLoading) return <CustomLoader />;

  return (
    <div className="p-5 h-full flex flex-col">
      <div className="mb-6">
        <div className="flex text-neutral-300 justify-between mb-2">
          <h2 className="text-2xl font-bold">📋 Today's Expenses</h2>
          <div className="text-2xl font-semibold">- ₹{getTotalAmount().toFixed(2)}</div>
        </div>
        <div className="font text-rose-400 font-semibold p-2">
          {formatDisplayDate(selectedDate)}
        </div>
      </div>

      <div className="grow custom-scroll overflow-y-auto space-y-3">
        {!data?.expenses?.length ? (
          <div className="text-center text-gray-500 py-12 italic">
            <div className="text-4xl mb-4">📝</div>
            No expenses recorded for this date
          </div>
        ) : (
          data.expenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between p-4 rounded-xl transition-all duration-200 border border-neutral-700"
            >
              <div className="flex-1">
                <div className="font-semibold mb-1">{expense.description || 'No description'}</div>
                <div className="text-xs text-emerald-400 font-semibold py-1 rounded-full inline-block">
                  {expense?.category?.emoji} {expense?.category?.label}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-xl font-bold text-red-600">- ₹{expense.amount.toFixed(2)}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ListExpenses;
