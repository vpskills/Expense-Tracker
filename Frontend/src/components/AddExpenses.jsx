import { Minus, Plus, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { formatDate, isFutureDate, isToday } from '../utils';
import InputField from '../ui/InputField';
import SelectField from '../ui/SelectField';
import { addExpense } from '../store/actions/expenses.actions';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchCategories } from '../store/actions/categories.actions';
import toast from 'react-hot-toast';

const AddExpenses = ({ selectedDate, setFormVisible }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isExpenseForm, setIsExpenseForm] = useState(true);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['categories', { page: 1, limit: 20 }],
    queryFn: () => fetchCategories({ page: 1, limit: 20 }),
    keepPreviousData: true, // for smoother pagination
  });

  const categories = data?.data || [];

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
    <div className="bg-neutral-950 z-40 border border-neutral-800 w-full p-5 rounded-2xl md:mt-2 text-gray-400">
      <div className="flex justify-between items-center mb-6">
        <h2 className="md:text-xl font-bold flex items-center gap-3">
          <Plus className={`${isExpenseForm ? 'text-rose-500' : 'text-emerald-500'}`} />
          {isExpenseForm ? 'Add Expense' : 'Add Received/Surplus'}
        </h2>

        <RefreshCw
          size={20}
          className={`${isExpenseForm && 'rotate-180'}  cursor-pointer hover:text-neutral-100 transition-all duration-500`}
          onClick={() => setIsExpenseForm(!isExpenseForm)}
        />
      </div>

      <div className="space-y-4">
        <InputField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}
          placeholder="What did you spend on?"
        />

        <InputField
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />

        {/* <SelectField
          label="Category"
          isLoading={isLoading}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          options={categories}
          placeholder="Select a category"
        /> */}

        <button
          onClick={handleAddExpense}
          disabled={isPending || isFutureDate(selectedDate)}
          className="w-full bg-emerald-600 text-white font-semibold mt-3 py-3 px-6 md:rounded-lg rounded-md hover:from-green-600 hover:to-green-700 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl disabled:opacity-50"
        >
          Add Expense
        </button>
      </div>
    </div>
  );
};

export default AddExpenses;
