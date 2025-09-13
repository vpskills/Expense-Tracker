import React, { useState, useEffect } from "react";

const ExpenseTracker = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState("");
  const [expenses, setExpenses] = useState({});
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const categories = [
    { id: "food", label: "Food", emoji: "🍕" },
    { id: "transport", label: "Transport", emoji: "🚗" },
    { id: "entertainment", label: "Fun", emoji: "🎬" },
    { id: "shopping", label: "Shopping", emoji: "🛒" },
    { id: "bills", label: "Bills", emoji: "📄" },
    { id: "other", label: "Other", emoji: "📦" },
  ];

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const formatDisplayDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - 1;
      days.push({
        day,
        date: new Date(year, month - 1, day),
        isCurrentMonth: false,
        isToday: false,
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const today = new Date();
      days.push({
        day,
        date,
        isCurrentMonth: true,
        isToday: date.toDateString() === today.toDateString(),
      });
    }

    // Next month days to fill grid
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        date: new Date(year, month + 1, day),
        isCurrentMonth: false,
        isToday: false,
      });
    }

    return days;
  };

  const addExpense = (e) => {
    e.preventDefault();

    if (!description.trim()) {
      alert("Please enter a description");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (!selectedCategory) {
      alert("Please select a category");
      return;
    }

    const dateStr = formatDate(selectedDate);
    
    const newExpense = {
      id: Date.now(),
      description: description.trim(),
      amount: parseFloat(amount),
      category: selectedCategory,
      timestamp: new Date().toISOString(),
    };

    setExpenses((prev) => ({
      ...prev,
      [dateStr]: [...(prev[dateStr] || []), newExpense],
    }));

    // Reset form
    setDescription("");
    setAmount("");
    setSelectedCategory("");

    // Show success feedback
    setIsAdding(true);
    setTimeout(() => setIsAdding(false), 1000);
  };

  const deleteExpense = (dateStr, expenseId) => {
    setExpenses((prev) => ({
      ...prev,
      [dateStr]: prev[dateStr].filter((expense) => expense.id !== expenseId),
    }));
  };

  const getExpensesForDate = (date) => {
    const dateStr = formatDate(date);
    return expenses[dateStr] || [];
  };

  const getTotalForDate = (date) => {
    const dayExpenses = getExpensesForDate(date);
    return dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const selectDate = (date) => {
    setSelectedDate(date);
  };

  const isDateSelected = (date) => {
    return formatDate(date) === formatDate(selectedDate);
  };

  const hasExpenses = (date) => {
    return getExpensesForDate(date).length > 0;
  };

  const getCategoryData = (categoryId) => {
    return (
      categories.find((cat) => cat.id === categoryId) ||
      categories[categories.length - 1]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 p-4">
      <div className="max-w-6xl mx-auto bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 text-center">
          <h1 className="text-4xl font-bold mb-2">💰 Expense Tracker</h1>
          <p className="text-xl opacity-90">
            Track your daily expenses with style
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 p-8">
          {/* Left Column - Calendar & Add Expense */}
          <div className="space-y-6">
            {/* Calendar Section */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                📅 Select Date
              </h2>

              {/* Calendar Header */}
              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg font-semibold transition-all hover:-translate-y-0.5"
                >
                  ‹
                </button>
                <h3 className="text-xl font-bold text-gray-700">
                  {currentDate.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </h3>
                <button
                  onClick={() => navigateMonth(1)}
                  className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg font-semibold transition-all hover:-translate-y-0.5"
                >
                  ›
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center font-semibold text-gray-600 p-2 text-sm"
                    >
                      {day}
                    </div>
                  )
                )}

                {getDaysInMonth(currentDate).map((dayObj, index) => (
                  <button
                    key={index}
                    onClick={() => selectDate(dayObj.date)}
                    className={`
                      aspect-square flex items-center justify-center rounded-lg font-medium transition-all duration-200 text-sm
                      ${
                        !dayObj.isCurrentMonth
                          ? "text-gray-400 hover:bg-gray-100"
                          : "text-gray-800 hover:bg-gray-100"
                      }
                      ${
                        isDateSelected(dayObj.date)
                          ? "bg-indigo-600 hover:bg-indigo-600 text-white scale-105"
                          : ""
                      }
                      ${
                        hasExpenses(dayObj.date) && !isDateSelected(dayObj.date)
                          ? "bg-yellow-200 border-2 border-yellow-400"
                          : ""
                      }
                      ${
                        dayObj.isToday && !isDateSelected(dayObj.date)
                          ? "ring-2 ring-indigo-300"
                          : ""
                      }
                    `}
                  >
                    {dayObj.day}
                  </button>
                ))}
              </div>
            </div>

            {/* Add Expense Section */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                ➕ Add Expense
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What did you spend on?"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all bg-gray-50 focus:bg-white"
                    onKeyPress={(e) => e.key === "Enter" && addExpense(e)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all bg-gray-50 focus:bg-white"
                    onKeyUp={(e) => e.key === "Enter" && addExpense(e)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Category
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setSelectedCategory(category.id)}
                        className={`
                          p-3 rounded-xl border-2 font-medium transition-all duration-200 hover:-translate-y-1
                          ${
                            selectedCategory === category.id
                              ? "bg-indigo-600 text-white border-indigo-500 shadow-lg"
                              : "bg-white border-gray-200 hover:border-indigo-400 text-gray-700"
                          }
                        `}
                      >
                        {category.emoji} {category.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={addExpense}
                  disabled={isAdding}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl disabled:opacity-50"
                >
                  {isAdding ? "✅ Added!" : "Add Expense"}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Expenses List */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <h2 className="text-2xl font-bold text-gray-800">
                    📋 Today's Expenses
                </h2>
                <div className="text-2xl font-semibold">
                    {"₹"}{getTotalForDate(selectedDate).toFixed(2)}
                </div>
              </div>
              <div className="bg-indigo-50 mx-auto rounded-lg p-2">
                <div className="text-sm font-semibold text-indigo-800">
                  {formatDisplayDate(selectedDate)}
                </div>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-3">
              {getExpensesForDate(selectedDate).length === 0 ? (
                <div className="text-center text-gray-500 py-12 italic">
                  <div className="text-4xl mb-4">📝</div>
                  No expenses recorded for this date
                </div>
              ) : (
                getExpensesForDate(selectedDate).map((expense) => {
                  const categoryData = getCategoryData(expense.category);
                  return (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 border border-gray-200"
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800 mb-1">
                          {expense.description}
                        </div>
                        <div className="text-sm bg-gray-200 text-gray-700  px-3 py-1 rounded-full inline-block">
                          {categoryData.emoji} {categoryData.label}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-xl font-bold text-red-600">
                          ${expense.amount.toFixed(2)}
                        </div>
                        <button
                          onClick={() =>
                            deleteExpense(formatDate(selectedDate), expense.id)
                          }
                          className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-lg transition-all hover:scale-105"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Total Section */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white text-center p-8">
          <div className="text-5xl font-bold mb-2">
            {"₹"}
            {getTotalForDate(selectedDate).toFixed(2)}
          </div>
          <div className="text-xl opacity-90">
            Total for {formatDisplayDate(selectedDate).split(",")[0]}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;
