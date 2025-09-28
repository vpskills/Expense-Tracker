import { useIsMutating, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteExpense, fetchExpensesByDate } from '../../store/actions/expenses.actions';
import CustomLoader from '../CustomLoader';
import toast from 'react-hot-toast';
import DisplayAllAmounts from './DisplayAllAmounts';
import NoExpenseBanner from './NoExpenseBanner';
import ExpenseDisplayCard from './ExpenseDisplayCard';
import {useNavigate} from 'react-router-dom'

const ListExpenses = ({ selectedDate }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const isAnyExpenseMutating = useIsMutating({ mutationKey: ['expenses', selectedDate] }) > 0;

  //data fetchin on date change
  const { data, isLoading } = useQuery({
    queryKey: ['expenses', selectedDate],
    queryFn: () => fetchExpensesByDate(selectedDate),
    refetchOnWindowFocus: false,
    enabled: !!selectedDate,
  });

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

  if (isLoading)
    return (
      <div className="h-svh">
        <CustomLoader className={'h-[75%]'} />
      </div>
    );

  return (
    <div className="md:p-5 h-svh md:h-full flex flex-col">
      <DisplayAllAmounts data={data} selectedDate={selectedDate} />

      <div className="grow custom-scroll overflow-y-auto md:space-y-3 pb-32 md:pb-0 overscroll-none">
        {!data?.expenses?.length ? (
          <NoExpenseBanner />
        ) : (
          data.expenses.map((expense) => (
            <div
              onClick={() => navigate(`/expense/details/${expense?.id}`, { state: { expense } })}
              key={expense.id}
              className="flex flex-col gap-2 p-2 md:rounded-xl transition-all duration-200 border-y md:border border-neutral-800"
            >
              <ExpenseDisplayCard
                expense={expense}
                deleteExpenseHandler={deleteExpenseHandler}
                isAnyExpenseMutating={isAnyExpenseMutating}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ListExpenses;
