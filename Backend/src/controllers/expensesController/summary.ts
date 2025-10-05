import { PrismaClient } from '@prisma/client';
import type { Response } from 'express';
import type { AuthRequest } from '../../middleware/auth.middleware.js';
import { ApiError } from '../../utils/ApiError.js';

const prisma = new PrismaClient();

export const getMonthlySummary = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { selectedDate } = req.query;

  if (!userId) {
    throw new ApiError('Unauthorized user!', 401);
  }

  if (!selectedDate || typeof selectedDate !== 'string') {
    return new ApiError('Missing or invalid parameters', 400);
  }

  const date = new Date(selectedDate);
  if (isNaN(date.getTime())) {
    return new ApiError('Invalid date format', 400);
  }

  // Construct start and end of month
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  const start = `${year}-${String(month).padStart(2, '0')}-01`;
  const end = `${year}-${String(month).padStart(2, '0')}-31`;

  // Fetch all expenses/incomes in month
  const transactions = await prisma.expense.findMany({
    where: {
      userId: String(userId),
      date: {
        gte: start,
        lte: end,
      },
    },
    select: { amount: true, isExpense: true },
  });

  //calculate tolals
  const totals = transactions?.reduce(
    (acc, tx) => {
      if (tx.isExpense) {
        acc.expense += tx.amount;
        acc.expenseCount += 1;
      } else {
        acc.income += tx.amount;
        acc.incomeCount += 1;
      }
      return acc;
    },
    { expense: 0, expenseCount: 0, income: 0, incomeCount: 0 }
  );

  res.status(200).json({
    month: `${date.toLocaleString('default', { month: 'long' })} ${year}`,
    totalTransactions: transactions?.length,
    incomeTransactions: totals.incomeCount,
    expenseTransactions: totals.expenseCount,
    totalExpense: totals.expense,
    totalIncome: totals.income,
    net: totals.income - totals.expense,
  });
};

export const getFullYearSummary = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { selectedDate } = req.query;

  if (!userId) {
    throw new ApiError('Unauthorized: Missing user ID', 401);
  }

  // Extract year (from query or from current date)
  const dateObj = selectedDate ? new Date(String(selectedDate)) : new Date();
  const year = dateObj.getFullYear();

  if (isNaN(year)) {
    throw new ApiError('Invalid year or date provided', 400);
  }

  // Build start and end date strings for comparison
  const start = `${year}-01-01`;
  const end = `${year}-12-31`;

  // Fetch all records where date string lies in range
  const transactions = await prisma.expense.findMany({
    where: {
      userId,
      date: { gte: start, lte: end },
    },
    select: {
      amount: true,
      isExpense: true,
      date: true,
    },
  });

  // ✅ Aggregate totals and counts
  const totals = {
    income: 0,
    expense: 0,
    incomeCount: 0,
    expenseCount: 0,
  };

  // ✅ Prepare month breakdown (Jan → Dec)
  const monthlyTotals = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    expense: 0,
    income: 0,
    expenseCount: 0,
    incomeCount: 0,
  }));

  for (const tx of transactions) {
    const monthIndex = new Date(tx.date).getMonth(); // 0–11
    const target = monthlyTotals[monthIndex];
    if (!target) continue;

    if (tx.isExpense) {
      totals.expense += tx.amount;
      totals.expenseCount++;
      target.expense += tx.amount;
      target.expenseCount++;
    } else {
      totals.income += tx.amount;
      totals.incomeCount++;
      target.income += tx.amount;
      target.incomeCount++;
    }
  }

  res.status(200).json({
    year,
    totalTransactions: transactions.length,
    incomeTransactions: totals.incomeCount,
    expenseTransactions: totals.expenseCount,
    totalExpense: totals.expense,
    totalIncome: totals.income,
    net: totals.income - totals.expense,
    monthlyBreakdown: monthlyTotals.map((m) => ({
      month: String(m.month).padStart(2, '0'),
      expense: m.expense,
      income: m.income,
      expenseTransactions: m.expenseCount,
      incomeTransactions: m.incomeCount,
      net: m.income - m.expense,
    })),
  });
};
