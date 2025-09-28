import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Tag,
  Edit3,
  Trash2,
  Sun,
  Moon,
  IndianRupee,
} from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export default function ExpenseDetailPage() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { expenseId } = useParams();
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const expense = routerLocation.state?.expense;

  const extractedTime = () => {
    const date = new Date(expense?.createdAt);
    const timeString = date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
    });
    return timeString;
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div
      key={expenseId}
      className={`min-h-screen transition-all duration-300 ${
        isDarkMode
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white'
          : 'bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900'
      }`}
    >
      {/* Header */}
      <div
        className={`sticky top-0 z-20 backdrop-blur-lg border-b transition-all duration-300 ${
          isDarkMode ? 'bg-gray-900/80 border-gray-700' : 'bg-white/80 border-gray-200'
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(-1)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-200 hover:scale-105 ${
                isDarkMode
                  ? 'hover:bg-gray-800 text-gray-300 hover:text-white'
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>

            <div className="flex items-center space-x-3">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-xl transition-all duration-200 hover:scale-110 ${
                  isDarkMode
                    ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <button
                className={`p-2 rounded-xl transition-all duration-200 hover:scale-110 ${
                  isDarkMode
                    ? 'bg-gray-800 hover:bg-gray-700 text-blue-400'
                    : 'bg-gray-100 hover:bg-gray-200 text-blue-600'
                }`}
              >
                <Edit3 className="w-5 h-5" />
              </button>

              <button
                className={`p-2 rounded-xl transition-all duration-200 hover:scale-110 ${
                  isDarkMode
                    ? 'bg-gray-800 hover:bg-red-900 text-red-400 hover:text-red-300'
                    : 'bg-gray-100 hover:bg-red-50 text-red-600 hover:text-red-700'
                }`}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Amount Card */}
        <div
          className={`relative overflow-hidden rounded-3xl p-8 mb-8 shadow-2xl transition-all duration-300 transform hover:scale-[1.02] ${
            isDarkMode
              ? 'bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 shadow-purple-500/20'
              : 'bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 shadow-blue-500/20'
          }`}
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <IndianRupee className="w-10 h-10 text-white" />
              </div>
            </div>
            <div className="text-center">
              <div className="text-5xl sm:text-6xl font-bold text-white mb-2 font-nunito">
                {expense.amount.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl transform translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl transform -translate-x-12 translate-y-12"></div>
        </div>

        {/* Details Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Category Card */}
          <div
            className={`p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
              isDarkMode
                ? 'bg-gray-800/80 border border-gray-700'
                : 'bg-white border border-gray-200'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div
                className={`p-3 rounded-xl ${
                  isDarkMode ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-600'
                }`}
              >
                <Tag className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3
                  className={`font-semibold mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}
                >
                  Category
                </h3>
                <p className={`md:text-lg ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                  {expense.category || 'Not Provided'}
                </p>
              </div>
            </div>
          </div>

          {/* Date Card */}
          <div
            className={`p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
              isDarkMode
                ? 'bg-gray-800/80 border border-gray-700'
                : 'bg-white border border-gray-200'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div
                className={`p-3 rounded-xl ${
                  isDarkMode ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-600'
                }`}
              >
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  Date & Time
                </h3>
                <p className={`text:sm md:text-lg ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  {new Date(expense.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {extractedTime()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div
          className={`mt-6 p-6 rounded-2xl shadow-lg transition-all duration-300 ${
            isDarkMode ? 'bg-gray-800/80 border border-gray-700' : 'bg-white border border-gray-200'
          }`}
        >
          <h3 className={`md:text-xl font-bold mb-6 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
            Description
          </h3>
          
          {expense.description && (
            <div className={`mt-4 p-4 text-sm md:text-base rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <p className={`leading-relaxed ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                {expense.description}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-200 ${
              isDarkMode
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/25'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/25'
            }`}
          >
            Edit Expense
          </button>

          <button
            className={`sm:w-auto px-6 py-4 rounded-xl font-semibold transition-all bg-rose-500 duration-200 ${
              isDarkMode
                ? 'bg-gray-700 hover:bg-red-600 hover:text-white border border-gray-600 hover:border-red-500'
                : 'bg-white hover:bg-red-600 text-gray-700 hover:text-white border border-gray-300 hover:border-red-500'
            }`}
          >
            Delete Expense
          </button>
        </div>
      </div>
    </div>
  );
}
