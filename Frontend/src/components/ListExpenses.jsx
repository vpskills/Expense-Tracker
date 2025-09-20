import { useIsMutating, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteExpense, fetchExpensesByDate } from '../store/actions/expenses.actions';
import CustomLoader from './CustomLoader';
import { useEffect } from 'react';
import { Loader, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDisplayDate } from '../utils';
import { FadeLoader } from 'react-spinners';
import { isMobile } from 'react-device-detect';

const ListExpenses = ({ selectedDate }) => {
  const queryClient = useQueryClient();
  const isAnyExpenseMutating = useIsMutating({ mutationKey: ['expenses', selectedDate] }) > 0;

  //data fetchin on date change
  const { data, isLoading } = useQuery({
    queryKey: ['expenses', selectedDate],
    queryFn: () => fetchExpensesByDate(selectedDate),
    enabled: !!selectedDate,
  });

  function getTotalAmount() {
    const dayExpenses = data?.expenses || [];
    return dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  }

  //delete single expense by id
  const { mutate: deleteExpenseMutation, isPending } = useMutation({
    mutationKey: ['expenses', selectedDate],
    mutationFn: (expId) => deleteExpense(expId), // API call
    onMutate: async (id) => {
      const queryKey = ['expenses', selectedDate];
      await queryClient.cancelQueries({ queryKey });
      const previousExpenses = queryClient.getQueryData(queryKey);

      if (previousExpenses?.expenses) {
        const filteredExpenses = previousExpenses.expenses.filter((expense) => expense.id !== id);
        queryClient.setQueryData(queryKey, (old) => ({
          ...old,
          expenses: filteredExpenses,
        }));
      }

      return { previousExpenses, queryKey };
    },
    onSuccess: (data) => {
      toast.success(data?.message || 'Expense deleted successfully');
    },
    onError: (error, _, context) => {
      toast.error('Error in deleting expense');
      console.error('Delete failed:', error);
      if (context?.previousExpenses) {
        queryClient.setQueryData(context.queryKey, context.previousExpenses);
      }
    },
    onSettled: (_, __, ___, context) => {
      queryClient.invalidateQueries({ queryKey: context?.queryKey });
    },
  });

  function deleteExpenseHandler(expId) {
    deleteExpenseMutation(expId);
  }

  if (isLoading) return <CustomLoader />;

  return (
    <div className="p-2 md:p-5 h-svh md:h-full flex flex-col">
      <div className="p-3 py-5 md:p-0 md:mb-6">
        <div className="flex text-neutral-300 justify-between mb-2">
          <h2 className="text-lg md:text-2xl font-bold">📋 Today's Expenses</h2>
          <div className="md:text-2xl font-semibold">- ₹{getTotalAmount().toFixed(2)}</div>
        </div>
        <div className="text-sm md:text-md text-rose-400 font-semibold p-2">
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
              className="flex items-center gap-2 justify-between p-4 rounded-xl transition-all duration-200 border border-neutral-800"
            >
              <div className="flex-1 whitespace-pre-wrap">
                <div className="text-xs md:text-sm mb-1 font-semibold font-mon mr-2">{expense.description || 'No description'}</div>
                {
                  <div className={`text-[12px] md:text-xs text-emerald-500 font-semibold inline-block`}>
                    {isAnyExpenseMutating && expense?.category===undefined ? (
                      <h1 className="h-3 min-w-24 rounded-md bg-neutral-600 animate-pulse transition-all">&nbsp;</h1>
                    ) : (
                      expense?.category && `${expense?.category?.emoji} ${expense?.category?.label}`
                    )}
                  </div>
                }
              </div>

              <div className="flex items-center gap-3">
                <div className="text-sm md:text-lg font-bold text-red-600">₹{expense.amount.toFixed(2)}</div>
              </div>

              {/* delete expense */}
              <button
                onClick={() => deleteExpenseHandler(expense.id)}
                disabled={isAnyExpenseMutating}
                className="rounded-full p-2 text-neutral-500 hover:text-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ListExpenses;
