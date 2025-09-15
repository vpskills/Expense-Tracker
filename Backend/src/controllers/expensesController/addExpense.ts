import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import type { AuthRequest } from '../../middleware/auth.middleware.js';
import { ApiError } from '../../utils/ApiError.js';

const prisma = new PrismaClient();

export const addExpense = async (req: AuthRequest, res: Response) => {
  const { amount, description, categoryId, date } = req.body;

  if (!amount || !date) {
    throw new ApiError('All fields are required', 400);
  }

  const expense = await prisma.expense.create({
    data: {
      amount: parseFloat(amount),
      description: description || null,
      date: new Date(date),
      userId: req.user!.id,
      categoryId: categoryId || null,
    },
  });

  if (!expense) {
    throw new ApiError('Failed to add expense', 500);
  }

  res.status(201).json({
    message: 'Expense added successfully',
    expense,
  });
};
