import { useIsMutating, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteExpense, fetchExpensesByDate } from '../store/actions/expenses.actions';
import CustomLoader from './CustomLoader';
import { useEffect, useState } from 'react';
import { Loader, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatCurrency, formatDisplayDate } from '../utils';
import { FadeLoader } from 'react-spinners';
import { isMobile } from 'react-device-detect';
import Skeleton from './Skeleton';

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
      { total: 0, expense: 0, income: 0}
    );
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
    <div className="md:p-5 h-svh md:h-full flex flex-col">
      <div className="md:p-0 md:mb-6 p-3">
        <div className="flex flex-col gap-3 md:gap-2 border border-neutral-700 rounded-md p-4 bg-neutral-900 overflow-x-auto mb-2">
          <div className="flex justify-between text-neutral-400">
            <span className='text-sm md:text-lg'>Income</span>
            <span className="text-emerald-500 text-sm font-semibold md:text-lg">
              {formatCurrency(getTotalAmount().income, true)}
            </span>
          </div>
          <div className="flex justify-between text-neutral-400">
            <span className='text-sm md:text-lg'>Spent</span>
            <span className="text-red-400 text-sm font-semibold md:text-lg">
              -{formatCurrency(getTotalAmount().expense, false)}
            </span>
          </div>
          <div className="flex justify-between text-neutral-400">
            <span className='text-sm md:text-lg'>Total</span>
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

      <div className="grow custom-scroll overflow-y-auto md:space-y-3">
        {!data?.expenses?.length ? (
          <div className="text-center flex items-center flex-col justify-center h-[70%] text-gray-500 py-12 italic">
            <div className="text-4xl mb-4">📝</div>
            No expenses recorded for this date
          </div>
        ) : (
          data.expenses.map((expense) => (
            <div
              key={expense.id}
              className="flex flex-col gap-2 p-2 md:rounded-xl transition-all duration-200 border border-neutral-800"
            >
              <div className="flex justify-between">
                <div className="p-2">
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

                  {/* Category Section */}
                  {/* <div
                    className={`text-[12px] md:text-xs text-emerald-500 font-semibold inline-block`}
                  >
                    {isAnyExpenseMutating && expense?.category === undefined ? (
                      <Skeleton />
                    ) : (
                      expense?.category && `${expense?.category?.emoji} ${expense?.category?.label}`
                    )}
                  </div> */}
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
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ListExpenses;
