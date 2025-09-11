import { Plus } from 'lucide-react';
import { useState } from 'react';
import { formatDate } from '../utils';
import InputField from '../ui/InputField';
import SelectField from '../ui/SelectField';
import { addExpense } from '../store/actions/expenses.actions';

const AddExpenses = ({ selectedDate, setExpenses }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const categories = [
    // 🍔 Food & Dining
    { id: 'groceries', label: 'Groceries', emoji: '🛒' },
    { id: 'restaurants', label: 'Restaurants', emoji: '🍽️' },
    { id: 'coffee', label: 'Coffee & Snacks', emoji: '☕' },
    { id: 'fast_food', label: 'Fast Food', emoji: '🍔' },
    { id: 'alcohol', label: 'Alcohol', emoji: '🍷' },
    { id: 'food_delivery', label: 'Food Delivery', emoji: '🚴‍♂️' },

    // 🚗 Transportation
    { id: 'fuel', label: 'Fuel / Gas', emoji: '⛽' },
    { id: 'public_transport', label: 'Public Transport', emoji: '🚌' },
    { id: 'taxi_rideshare', label: 'Taxi & Rideshare', emoji: '🚕' },
    { id: 'car_maintenance', label: 'Car Maintenance', emoji: '🛠️' },
    { id: 'parking', label: 'Parking', emoji: '🅿️' },
    { id: 'vehicle_insurance', label: 'Vehicle Insurance', emoji: '📄' },

    // 🏡 Housing & Utilities
    { id: 'rent', label: 'Rent', emoji: '🏠' },
    { id: 'mortgage', label: 'Mortgage', emoji: '🏦' },
    { id: 'electricity', label: 'Electricity', emoji: '💡' },
    { id: 'water', label: 'Water Bill', emoji: '🚰' },
    { id: 'gas', label: 'Gas Bill', emoji: '🔥' },
    { id: 'internet', label: 'Internet', emoji: '🌐' },
    { id: 'phone', label: 'Phone Bill', emoji: '📱' },
    { id: 'home_maintenance', label: 'Home Maintenance', emoji: '🛠️' },

    // 🛍️ Shopping
    { id: 'clothing', label: 'Clothing', emoji: '👕' },
    { id: 'electronics', label: 'Electronics', emoji: '💻' },
    { id: 'personal_care', label: 'Personal Care', emoji: '🧴' },
    { id: 'furniture', label: 'Furniture', emoji: '🪑' },
    { id: 'beauty', label: 'Beauty & Cosmetics', emoji: '💄' },

    // 🎉 Entertainment & Leisure
    { id: 'movies', label: 'Movies & Shows', emoji: '🎬' },
    { id: 'streaming', label: 'Streaming Services', emoji: '📺' },
    { id: 'gaming', label: 'Gaming', emoji: '🎮' },
    { id: 'books', label: 'Books & Magazines', emoji: '📚' },
    { id: 'events', label: 'Events & Concerts', emoji: '🎟️' },
    { id: 'vacation', label: 'Vacation & Travel', emoji: '✈️' },
    { id: 'hobbies', label: 'Hobbies', emoji: '🎨' },

    // 🏥 Health & Fitness
    { id: 'gym', label: 'Gym Membership', emoji: '🏋️' },
    { id: 'sports', label: 'Sports & Activities', emoji: '⚽' },
    { id: 'doctor', label: 'Doctor Visits', emoji: '👨‍⚕️' },
    { id: 'medications', label: 'Medications', emoji: '💊' },
    { id: 'health_insurance', label: 'Health Insurance', emoji: '🏥' },
    { id: 'therapy', label: 'Therapy', emoji: '🧠' },

    // 💼 Work & Education
    { id: 'office_supplies', label: 'Office Supplies', emoji: '📎' },
    { id: 'courses', label: 'Courses & Education', emoji: '🎓' },
    { id: 'subscriptions', label: 'Professional Subscriptions', emoji: '📰' },

    // 🐶 Pets
    { id: 'pet_food', label: 'Pet Food', emoji: '🐾' },
    { id: 'pet_care', label: 'Pet Care & Grooming', emoji: '✂️' },
    { id: 'vet', label: 'Vet Visits', emoji: '🩺' },

    // 💳 Financial Expenses
    { id: 'loans', label: 'Loan Payments', emoji: '💳' },
    { id: 'credit_card', label: 'Credit Card Payments', emoji: '💰' },
    { id: 'bank_fees', label: 'Bank Fees', emoji: '🏦' },
    { id: 'investments', label: 'Investments', emoji: '📈' },
    { id: 'savings', label: 'Savings', emoji: '💵' },

    // 🎁 Gifts & Donations
    { id: 'gifts', label: 'Gifts', emoji: '🎁' },
    { id: 'charity', label: 'Charity & Donations', emoji: '🤝' },

    // 📦 Miscellaneous
    { id: 'subscriptions_misc', label: 'Subscriptions', emoji: '🔔' },
    { id: 'insurance_other', label: 'Other Insurance', emoji: '📝' },
    { id: 'other', label: 'Other', emoji: '📦' },
  ];

  const addExpenseFn = async () => {
    if (!description.trim()) {
      alert('Please enter a description');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (!selectedCategory) {
      alert('Please select a category');
      return;
    }

    const newExpenseData = {
      amount: parseFloat(amount),
      description,
      categoryId: selectedCategory,  // IMPORTANT: Use categoryId, not just label
      date: selectedDate,
      userId: "clm3pj0ds00009k7q4qf0a3gq", // get from auth context later
    };

    await addExpense(newExpenseData);

    const dateStr = formatDate(selectedDate);

    setExpenses((prev) => ({
      ...prev,
      [dateStr]: [...(prev[dateStr] || []), newExpense],
    }));
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
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          options={categories}
          placeholder="Select a category"
        />

        <button
          onClick={addExpenseFn}
          className="w-full bg-emerald-600 text-white font-semibold mt-5 py-3 px-6 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl disabled:opacity-50"
        >
          Add Expense
        </button>
      </div>
    </div>
  );
};

export default AddExpenses;
