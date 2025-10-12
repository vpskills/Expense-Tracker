import React from 'react';
import { Circle, CircleCheckBig, Trash2 } from 'lucide-react';
import ExpenseCategory from './ExpenseCategory';
import { editExpense } from '../../store/actions/expenses.actions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const ExpenseDisplayCard = ({
  selectedDate,
  isAnyExpenseMutating,
  expense,
  deleteExpenseHandler,
}) => {
  const queryClient = useQueryClient();

  const { mutate: editExpenseMutaion, isPending: updateStatusPending } = useMutation({
    mutationFn: editExpense,
    onMutate: async (expenseEditDetails) => {
      const queryKey = ['expenses', selectedDate];
      await queryClient.cancelQueries({ queryKey });
      const previousExpenses = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old) => {
        const newData = old?.expenses?.map((expense) =>
          expense.id === expenseEditDetails?.id
            ? { ...expense, paidForOtherStatus: expenseEditDetails?.paidForOtherStatus }
            : expense
        );
        return {
          ...old,
          expenses: newData,
        };
      });

      return { previousExpenses, queryKey };
    },
    onSuccess: (resp) => {
      if (resp?.data?.id) {
        toast.success(resp?.message || 'Update Successfull');
      } else {
        toast.error('Update not synced!, Try again later.');
      }
    },
    onError: (error, _, context) => {
      if (context?.previousExpenses) {
        queryClient.setQueryData(context.queryKey, context.previousExpenses);
      }
      toast.error(error.message || 'Updation failed!');
      console.error('Edit failed:', error);
    },
  });

  return (
    <div className="flex justify-between">
      <div className="p-2 space-y-2">
        {/* Description */}
        <div
          className={`text-sm font-semibold font-mon whitespace-pre-wrap ${
            expense?.isPaidForOther && expense?.paidForOtherStatus
              ? 'line-through line-clamp-1'
              : ''
          }`}
        >
          {expense?.description || 'No description'}
        </div>

        {/* Amount Section */}
        <div
          className={`text-sm md:text-lg font-semibold ${
            expense?.isExpense ? 'text-red-400' : 'text-emerald-400'
          }`}
        >
          {expense?.isExpense ? '-₹' + expense.amount.toFixed(2) : '+₹' + expense.amount.toFixed(2)}
        </div>

        {/* Category with Checkbox */}
        <div className="flex items-center gap-2">
          <ExpenseCategory isAnyExpenseMutating={isAnyExpenseMutating} expense={expense} />
          {expense?.isPaidForOther && (
            <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-1">
              {expense?.paidForOtherStatus ? (
                <>
                  <CircleCheckBig
                    onClick={() => {
                      if (updateStatusPending) return;
                      editExpenseMutaion({ id: expense?.id, paidForOtherStatus: false });
                    }}
                    size={18}
                    strokeWidth={3}
                    className="text-emerald-400 cursor-pointer"
                  />
                  <span className="text-[10px] text-emerald-400 font-medium tracking-wider underline underline-offset-4">
                    DONE
                  </span>
                </>
              ) : (
                <>
                  <Circle
                    onClick={() => {
                      if (updateStatusPending) return;
                      editExpenseMutaion({ id: expense?.id, paidForOtherStatus: true });
                    }}
                    size={18}
                    strokeWidth={3}
                    className="text-red-500 cursor-pointer"
                  />
                  <span className="text-[10px] text-red-500 font-medium tracking-wider underline underline-offset-4">
                    PENDING
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* delete expense */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          deleteExpenseHandler(expense?.id);
        }}
        disabled={isAnyExpenseMutating}
        className="rounded-full p-2 text-neutral-500 hover:text-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
};

export default ExpenseDisplayCard;
