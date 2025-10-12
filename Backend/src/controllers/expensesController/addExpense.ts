import type { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import type { AuthRequest } from '../../middleware/auth.middleware.js';
import { ApiError } from '../../utils/ApiError.js';

const prisma = new PrismaClient();

export const addExpense = async (req: AuthRequest, res: Response) => {
  const { amount, description, categoryId, date, isExpense } = req.body;

  if (!amount || !date) {
    throw new ApiError('All fields are required', 400);
  }

  // Normalize to YYYY-MM-DD
  const formattedDate = new Date(date).toISOString().split('T')[0];

  // ✅ Check if category is "Paid For Other" (specific ID)
  const PAID_FOR_OTHER_CATEGORY_ID = 'cmgmivdgc0000aodcdqyqtt1h';
  const isPaidForOther = categoryId === PAID_FOR_OTHER_CATEGORY_ID;

  const expense = await prisma.expense.create({
    data: {
      amount: parseFloat(amount),
      description: description || null,
      date: formattedDate || "",
      userId: req.user!.id,
      categoryId: categoryId || null,
      isPaidForOther,
      isExpense,
    },
    include: { category: true },
  });

  if (!expense) {
    throw new ApiError('Failed to add expense', 500);
  }

  res.status(201).json({
    message: 'Expense added successfully',
    expense,
  });
};
