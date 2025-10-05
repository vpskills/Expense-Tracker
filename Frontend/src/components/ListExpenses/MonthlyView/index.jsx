import { useQuery } from '@tanstack/react-query';
import { ArrowDownRight, ArrowUpRight, Loader2, TrendingUp } from 'lucide-react';
import { getMonthlySummary } from '../../../store/actions/expenses.actions';
import { formatCurrency } from '../../../utils';

const MonthlyExpenseView = ({ selectedDate }) => {
  const {
    data: monthlyData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['monthly-summary', selectedDate],
    queryFn: () => getMonthlySummary({ selectedDate: selectedDate.toLocaleDateString('en-CA') }),
    refetchOnWindowFocus: false,
    enabled: !!selectedDate,
    keepPreviousData: true,
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-10 text-gray-400">
        <Loader2 className="animate-spin mr-2" /> Loading summary...
      </div>
    );

  return (
    <div className="p-4 pt-0">
      {/* Net Balance Card */}
      <div className="bg-gradient-to-br from-sky-900 to-indigo-950 rounded-2xl shadow-xl p-5 my-5 text-white">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-medium opacity-90">Monthly Net Balance</h2>
          <TrendingUp size={24} />
        </div>
        <div className="text-3xl font-bold mb-2">{formatCurrency(monthlyData?.net)}</div>
      </div>

      <div className="grid grid-cols md:grid-cols-2 gap-5">
        <div className="border-1 border-neutral-700 rounded-2xl shadow-lg p-4 border-l-2 border-l-green-500">
          <div className="flex items-center justify-between mb-4">
            <div className="text-slate-300 font-medium">Total Income</div>
            <ArrowUpRight className="text-green-500" size={24} />
          </div>
          <div className="text-xl font-bold text-emerald-500 mb-2">
            {formatCurrency(monthlyData?.totalIncome, false)}
          </div>
          <p className="text-sm text-slate-500 font-medium">
            {monthlyData?.incomeTransactions} transactions
          </p>
        </div>

        <div className="border-1 border-neutral-700 rounded-2xl shadow-lg p-4 border-l-2 border-l-red-500">
          <div className="flex items-center justify-between mb-4">
            <div className="text-slate-300 font-medium">Total Expenses</div>
            <ArrowDownRight className="text-red-500" size={24} />
          </div>
          <div className="text-xl font-bold  mb-2 text-rose-600">
            {formatCurrency(monthlyData?.totalExpense, false)}
          </div>
          <p className="text-sm text-slate-500 font-medium">
            {monthlyData?.expenseTransactions} transactions
          </p>
        </div>
      </div>
    </div>
  );
};

export default MonthlyExpenseView;
