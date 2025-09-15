import { PrismaClient } from '@prisma/client';
import { ApiError } from '../../utils/ApiError.js';
import type { Response, Request } from 'express';

const prisma = new PrismaClient();

export const getCategories = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const categories = await prisma.category.findMany({
    skip,
    take: limit,
    orderBy: { label: 'asc' },
  });

  if (!categories || categories.length === 0) {
    throw new ApiError('No categories found', 404);
  }

  res.status(200).json({
    success: true,
    count: categories?.length,
    data: categories,
  });
};
