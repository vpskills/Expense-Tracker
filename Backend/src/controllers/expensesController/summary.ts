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
        lt: end,
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
