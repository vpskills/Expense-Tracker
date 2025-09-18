import { Plus } from 'lucide-react';
import { useState } from 'react';
import { formatDate, isToday } from '../utils';
import InputField from '../ui/InputField';
import SelectField from '../ui/SelectField';
import { addExpense } from '../store/actions/expenses.actions';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchCategories } from '../store/actions/categories.actions';
import toast from 'react-hot-toast';

const AddExpenses = ({ selectedDate, setExpensesAdded }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['categories', { page: 1, limit: 20 }],
    queryFn: () => fetchCategories({ page: 1, limit: 20 }),
    keepPreviousData: true, // for smoother pagination
  });

  const categories = data?.data || [];

  // Mutation for adding expense
  const { mutate: addExpenseMutation, isPending } = useMutation({
    mutationFn: addExpense,
    onSuccess: (expenseData) => {
      toast.success(expenseData?.message || 'Expense added successfully!');
      setDescription('');
      setAmount('');
      setSelectedCategory('');
      setExpensesAdded(true);
    },
    onError: (error) => {
      toast.error(error.message || 'Adding Expense Failed!');
      setExpensesAdded(false);
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
    };
    addExpenseMutation(newExpenseData);
  };

  return (
    <div className="bg-neutral-950 p-5 rounded-2xl mt-2 text-gray-400">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <Plus strokeWidth={3} className="mb-1" /> Add Expense
      </h2>

      <div className="space-y-4">
        <InputField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What did you spend on?"
        />

        <InputField
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />

        <SelectField
          label="Category"
          isLoading={isLoading}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          options={categories}
          placeholder="Select a category"
        />

        <button
          onClick={handleAddExpense}
          disabled={isPending || !isToday(selectedDate)}
          className="w-full bg-emerald-600 text-white font-semibold mt-3 py-3 px-6 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl disabled:opacity-50"
        >
          Add Expense
        </button>
      </div>
    </div>
  );
};

export default AddExpenses;
