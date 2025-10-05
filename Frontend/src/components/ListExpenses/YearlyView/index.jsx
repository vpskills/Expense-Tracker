import { useState } from 'react';
import {
  ChevronLeft,
  TrendingUp,
  TrendingDown,
  IndianRupee,
  ArrowDownRight,
  ArrowUpRight,
  Loader2,
} from 'lucide-react';
import { formatCurrency } from '../../../utils';
import { getYearlySummary } from '../../../store/actions/expenses.actions';
import { useQuery } from '@tanstack/react-query';

export default function YearExpenseView({ selectedDate }) {
  const {
    data: backendData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['yearly-summary', selectedDate],
    queryFn: () => getYearlySummary({ selectedDate: selectedDate.toLocaleDateString('en-CA') }),
    refetchOnWindowFocus: false,
    enabled: !!selectedDate,
    keepPreviousData: true,
  });

  const [selectedYear, setSelectedYear] = useState(
    backendData?.year || new Date(selectedDate).getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = useState(null);

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-10 text-gray-400">
        <Loader2 className="animate-spin mr-2" /> Loading summary...
      </div>
    );

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const formatIndianCurrency = (amount) => {
    return amount.toLocaleString('en-IN');
  };

  const getPreviousMonthExpense = (currentIndex) => {
    for (let i = currentIndex - 1; i >= 0; i--) {
      if (backendData.monthlyBreakdown[i].expense > 0) {
        return backendData.monthlyBreakdown[i].expense;
      }
    }
    return null;
  };

  const calculateChange = (currentExpense, monthIndex) => {
    if (currentExpense === 0) return null;
    const prevExpense = getPreviousMonthExpense(monthIndex);
    if (prevExpense === null || prevExpense === 0) return null;
    return (((currentExpense - prevExpense) / prevExpense) * 100).toFixed(1);
  };

  return (
    <div className="h-svh pb-16 md:h-full flex flex-col gap-5 bg-gradient-to-br text-white p-4">
      {/* Net Amount Section */}
      <div className="bg-gradient-to-br from-sky-900 to-indigo-950 rounded-2xl shadow-xl p-4 text-white">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-md font-medium opacity-90">Yearly Net Balance</h2>
          <TrendingUp size={24} />
        </div>
        <div className="text-2xl font-bold mb-2">{formatCurrency(backendData?.net)}</div>
      </div>

      {/* Expense and imcome cards */}
      <div className="grid grid-cols-2 gap-5">
        <div className="border-1 border-neutral-700 rounded-2xl shadow-lg p-3 border-l-2 border-l-green-500">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-slate-300 font-medium">Total Income</div>
            <ArrowUpRight className="text-green-500" size={24} />
          </div>
          <div className="text-xl font-bold text-emerald-500 mb-2">
            {formatCurrency(backendData?.totalIncome, false)}
          </div>
          <p className="text-xs text-slate-500 font-medium">
            {backendData?.incomeTransactions} transactions
          </p>
        </div>

        <div className="border-1 border-neutral-700 rounded-2xl shadow-lg p-3 border-l-2 border-l-red-500">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-slate-300 font-medium">Total Expenses</div>
            <ArrowDownRight className="text-red-500" size={24} />
          </div>
          <div className="text-xl font-bold  mb-2 text-rose-600">
            {formatCurrency(backendData?.totalExpense, false)}
          </div>
          <p className="text-xs text-slate-500 font-medium">
            {backendData?.expenseTransactions} transactions
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grow custom-scroll overflow-y-auto overscroll-none pb-30">
        {!selectedMonth ? (
          // Month Grid View
          <div className="grid md:grid-cols-3 gap-3">
            {months.map((month, idx) => {
              const data = backendData.monthlyBreakdown[idx];
              const change = calculateChange(data.expense, idx);
              const hasData = data.expenseTransactions > 0;

              return (
                <button
                  key={idx}
                  onClick={() => hasData && setSelectedMonth(idx)}
                  className={`${
                    hasData
                      ? 'bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transform hover:scale-105 active:scale-95'
                      : 'bg-white/5 backdrop-blur-sm border border-white/5 opacity-60 cursor-not-allowed'
                  } rounded-xl p-4 transition`}
                  disabled={!hasData}
                >
                  <p className="text-xs text-gray-400 mb-2">{month}</p>
                  {hasData ? (
                    <>
                      <p className="text-lg font-bold mb-2 flex items-center justify-center gap-1">
                        <IndianRupee size={16} />
                        {formatIndianCurrency(data.expense)}
                      </p>
                      {change !== null && (
                        <div className="flex items-center justify-center gap-1">
                          {parseFloat(change) > 0 ? (
                            <TrendingUp size={12} className="text-red-400" />
                          ) : (
                            <TrendingDown size={12} className="text-green-400" />
                          )}
                          <span
                            className={`text-xs ${
                              parseFloat(change) > 0 ? 'text-red-400' : 'text-green-400'
                            }`}
                          >
                            {Math.abs(parseFloat(change))}%
                          </span>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-1">{data.expenseTransactions} txns</p>
                    </>
                  ) : (
                    <>
                      <p className="text-lg font-bold mb-2">-</p>
                      <p className="text-xs text-gray-500">No data</p>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          // Transaction Detail View
          <div>
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setSelectedMonth(null)}
                className="flex items-center gap-2 text-purple-400 hover:text-purple-300"
              >
                <ChevronLeft size={20} />
                <span>Back</span>
              </button>
              <h2 className="text-xl font-bold">
                {months[selectedMonth]} {selectedYear}
              </h2>
              <div className="w-16"></div>
            </div>

            {/* Month Summary Card */}
            <div className="bg-gradient-to-br from-red-600/20 to-orange-600/20 border border-red-500/30 rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Spent</p>
                  <p className="text-3xl font-bold flex items-center gap-1">
                    <IndianRupee size={28} />
                    {formatIndianCurrency(backendData.monthlyBreakdown[selectedMonth].expense)}
                  </p>
                </div>
                {calculateChange(
                  backendData.monthlyBreakdown[selectedMonth].expense,
                  selectedMonth
                ) !== null && (
                  <div
                    className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                      parseFloat(
                        calculateChange(
                          backendData.monthlyBreakdown[selectedMonth].expense,
                          selectedMonth
                        )
                      ) > 0
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-green-500/20 text-green-400'
                    }`}
                  >
                    {parseFloat(
                      calculateChange(
                        backendData.monthlyBreakdown[selectedMonth].expense,
                        selectedMonth
                      )
                    ) > 0 ? (
                      <TrendingUp size={16} />
                    ) : (
                      <TrendingDown size={16} />
                    )}
                    <span className="text-sm font-semibold">
                      {Math.abs(
                        parseFloat(
                          calculateChange(
                            backendData.monthlyBreakdown[selectedMonth].expense,
                            selectedMonth
                          )
                        )
                      )}
                      %
                    </span>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-400">
                {backendData.monthlyBreakdown[selectedMonth].expenseTransactions} transactions
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
