import { PrismaClient } from '@prisma/client';
import type { Request, Response } from 'express';
import { ApiError } from '../../utils/ApiError.js';
import type { AuthRequest } from '../../middleware/auth.middleware.js';

const prisma = new PrismaClient();

export const deleteUserSpecificCategory = async (req: AuthRequest, res: Response) => {
  const categoryId = req.query.id as string;

  if (!categoryId) {
    throw new ApiError('Category id is missing!', 400);
  }

  // check if category exists
  const existingCategory = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!existingCategory) {
    throw new ApiError('Category not found', 404);
  }

  // delete category
  const deletedCategory = await prisma.category.delete({
    where: { id: categoryId },
  });

  res.status(200).json({
    message: 'Category deleted successfully',
    category: deletedCategory,
  });
};
