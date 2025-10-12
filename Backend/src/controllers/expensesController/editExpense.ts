import { PrismaClient } from '@prisma/client';
import type { Request, Response } from 'express';
import { ApiError } from '../../utils/ApiError.js';

const prisma = new PrismaClient();

export const editSingleExpense = async (req: Request, res: Response) => {
  const { id, amount, desc, paidForOtherStatus } = req.body;

  if (amount === undefined && desc === undefined && paidForOtherStatus === undefined) {
    throw new ApiError('No fields provided to update!', 400);
  }

  if (!id) {
    throw new ApiError('Expense ID is missing!', 400);
  }

  // ✅ Check if expense exists
  const existingExpense = await prisma.expense.findUnique({
    where: { id },
  });

  if (!existingExpense) {
    throw new ApiError('Expense not found', 404);
  }

  // ✅ Validate amount only if provided
  if (amount !== undefined && (isNaN(Number(amount)) || Number(amount) < 0)) {
    throw new ApiError('Invalid amount!', 400);
  }

  // ✅ Validate description only if provided
  if (desc !== undefined && (typeof desc !== 'string' || desc.trim().length === 0)) {
    throw new ApiError('Invalid description!', 400);
  }

  // ✅ Update expense with fallback to existing values
  const updatedExpense = await prisma.expense.update({
    where: { id },
    data: {
      amount: amount !== undefined ? Number(amount) : existingExpense.amount,
      description: desc !== undefined ? desc.trim() : existingExpense.description,
      paidForOtherStatus:
        paidForOtherStatus !== undefined ? paidForOtherStatus : existingExpense.paidForOtherStatus,
    },
  });

  return res.status(200).json({
    message: 'Expense updated successfully',
    data: updatedExpense,
  });
};
