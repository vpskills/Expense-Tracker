import { PrismaClient } from '@prisma/client';
import type { Request, Response } from 'express';
import { ApiError } from '../../utils/ApiError.js';

const prisma = new PrismaClient();

export const deleteSingleExpense = async (req: Request, res: Response) => {
  const expenseId = req.query.id as string;

  if (!expenseId) {
    throw new ApiError('Expense id is missing!', 400);
  }

  // check if expense exists
  const existingExpense = await prisma.expense.findUnique({
    where: { id: expenseId },
  });

  if (!existingExpense) {
    throw new ApiError('Expense not found', 404);
  }

  // delete expense
  const deletedExpense = await prisma.expense.delete({
    where: { id: expenseId },
  });

  res.status(200).json({
    message: 'Expense deleted successfully',
    expense: deletedExpense,
  });
};
