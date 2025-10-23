import { ArrowRightLeft, ArrowRightLeftIcon, Minus, Plus, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatDate, isFutureDate, isToday } from '../utils';
import InputField from '../ui/InputField';
import SelectField from '../ui/SelectField';
import { addExpense } from '../store/actions/expenses.actions';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteUserCategory, fetchCategories } from '../store/actions/categories.actions';
import toast from 'react-hot-toast';
import { isMobile } from 'react-device-detect';

const AddExpenses = ({ selectedDate, setFormVisible }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isExpenseForm, setIsExpenseForm] = useState(true);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const queryClient = useQueryClient();

  const { data, isLoading} = useQuery({
    queryKey: ['categories', { page, limit: 10 }],
    queryFn: () => fetchCategories({ page, limit: 10 }),
    keepPreviousData: true, // for smoother pagination
  });

  const refetchCategories = () => {
    setPage((prev) => prev + 1)
  }

  useEffect(() => {
    if (data?.data && page > 1) {
      setCategories((prev) => [...prev, ...data?.data]);
    } else if (page === 1) {
      setCategories(data?.data || []);
    }
  }, [data]);

  //Mutation for delete category
  const {mutate: deleteCategoryMutation, isPending: categoryDeletePending} = useMutation({
    mutationFn: deleteUserCategory,
    onSuccess: (data) => {
      const filteredCat = categories?.filter(cat => cat?.id !== data?.category?.id);
      setCategories(filteredCat);
    }
  })

  // Mutation for adding expense
  const { mutate: addExpenseMutation, isPending } = useMutation({
    mutationKey: ['expenses', selectedDate],
    mutationFn: addExpense,
    onMutate: async (newExpense) => {
      const queryKey = ['expenses', selectedDate];
      await queryClient.cancelQueries({ queryKey });
      const previousExpenses = queryClient.getQueryData(queryKey);
      const fakeId = Math.random().toString();

      queryClient.setQueryData(queryKey, (old) => {
        if (!old) {
          return {
            message: 'Expenses fetched successfully',
            expenses: [{ ...newExpense, id: fakeId }],
          };
        }
        return {
          ...old,
          expenses: [{ ...newExpense, id: fakeId }, ...old.expenses],
        };
      });
      setFormVisible((prev) => !prev);
      return { previousExpenses, fakeId, queryKey };
    },

    onError: (err, newExpense, context) => {
      console.error(err);
      if (context?.previousExpenses) {
        queryClient.setQueryData(context.queryKey, context.previousExpenses);
      }
      toast.error('Adding expense failed!');
    },

    // Replace old expense object with fake id, by new expense object we get from server.
    onSuccess: (data, _, context) => {
      queryClient.setQueryData(context?.queryKey, (old) => {
        if (!old) return data;
        return {
          ...old,
          expenses: old.expenses.map((exp) => (exp.id === context?.fakeId ? data.expense : exp)),
        };
      });
      setDescription('');
      setAmount('');
      setSelectedCategory('');
    },

    onSettled: (_, __, ___, context) => {
      queryClient.invalidateQueries({ queryKey: context?.queryKey });
    },
  });

  const handleAddExpense = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    const formattedDate = formatDate(selectedDate);
    const newExpenseData = {
      amount: parseFloat(amount),
      description: description?.trim() || null,
      categoryId: selectedCategory || null,
      date: formattedDate,
      isExpense: isExpenseForm,
    };
    addExpenseMutation(newExpenseData);
  };

  return (
    <div className="bg-blue-50 dark:bg-neutral-950 z-40 border border-blue-100 dark:border-neutral-800 w-full p-5 rounded-2xl md:mt-2 max-h-11/12 overflow-auto custom-scroll text-blue-950 dark:text-gray-400">
      <div className="flex border border-blue-200 dark:border-neutral-800 rounded-full overflow-hidden justify-between items-center mb-6">
        <h2
          onClick={() => setIsExpenseForm(true)}
          className={`flex-1 ${isExpenseForm && "bg-blue-200 dark:bg-neutral-800"} cursor-pointer dark:border-r p-2 px-4 border-neutral-700 hover:text-gray-300  md:text-xl font-bold flex items-center gap-2`}
        >
          <Plus className={'text-rose-500'} />
          Expense
        </h2>
        <h2
          onClick={() => setIsExpenseForm(false)}
          className={`flex-1 ${!isExpenseForm && "bg-blue-200 dark:bg-neutral-800"} cursor-pointer hover:text-gray-300 p-2 px-4 md:text-xl font-bold flex items-center gap-2 justify-end`}
        >
          <Plus className="text-emerald-500" />
          Income
        </h2>
      </div>

      <div className="space-y-4">
        <InputField
          label="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))
          }
          placeholder="What did you spend on?"
        />

        <InputField
          mendatory={true}
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />

        <SelectField
          label="Category"
          createBtn={true}
          isLoading={isLoading}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          options={categories}
          placeholder="Select a category"
          refetchCategories={refetchCategories}
          deleteCategoryMutation={deleteCategoryMutation}
          categoryDeletePending={categoryDeletePending}
          currentPage={data?.page}
          totalPages={data?.totalPages}
        />

        <button
          onClick={handleAddExpense}
          disabled={isPending || isFutureDate(selectedDate)}
          className={`w-full ${
            isExpenseForm ? 'bg-rose-700' : 'bg-emerald-700'
          } text-white font-semibold mt-4 py-3 px-6 md:rounded-lg rounded-full hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl disabled:opacity-50`}
        >
          {isExpenseForm ? 'Add Expense' : 'Add Amount'}
        </button>
      </div>
    </div>
  );
};

export default AddExpenses;
