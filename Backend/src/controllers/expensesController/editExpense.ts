import { PrismaClient } from '@prisma/client';
import type { Request, Response } from 'express';
import { ApiError } from '../../utils/ApiError.js';

const prisma = new PrismaClient();

export const editSingleExpense = async (req: Request, res: Response) => {
  const { id, amount, desc } = req.body;

  if (!id) {
    throw new ApiError('Expense id is missing!', 400);
  }

  // Optional: basic field validation
  if (amount == null || isNaN(Number(amount))) {
    throw new ApiError('Invalid or missing amount!', 400);
  }

  if (!desc || typeof desc !== 'string' || desc.trim().length === 0) {
    throw new ApiError('Description is required!', 400);
  }

  // ✅ Check if expense exists
  const existingExpense = await prisma.expense.findUnique({
    where: { id },
  });

  if (!existingExpense) {
    throw new ApiError('Expense not found', 404);
  }

  // ✅ Update expense
  const updatedExpense = await prisma.expense.update({
    where: { id },
    data: {
      amount: Number(amount),
      description: desc.trim(),
    },
  });

  return res.status(200).json({
    message: 'Expense updated successfully',
    data: updatedExpense,
  });
};
