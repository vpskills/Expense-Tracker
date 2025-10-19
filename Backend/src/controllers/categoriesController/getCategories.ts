import { PrismaClient } from '@prisma/client';
import { ApiError } from '../../utils/ApiError.js';
import type { Response } from 'express';
import type { AuthRequest } from '../../middleware/auth.middleware.js';

const prisma = new PrismaClient();

export const getCategories = async (req: AuthRequest, res: Response) => {
  const user = req.user;
  if (!user) throw new ApiError('unauthorized user!', 401);

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      where: {
        OR: [
          { userId: user?.id }, // created by user
          { userId: null },     // global categories
        ],
      },
      orderBy: [
        { userId: 'asc' }, // user-specific first
        { label: 'desc' }, // alphabetical
      ],
      skip,
      take: limit,
    }),
    prisma.category.count({
      where: {
        OR: [
          { userId: user?.id },
          { userId: null },
        ],
      },
    }),
  ]);

  if (!categories || categories.length === 0) {
    throw new ApiError('No categories found', 404);
  }

  res.status(200).json({
    success: true,
    page,
    totalPages: Math.ceil(total / limit),
    totalItems: total,
    count: categories.length,
    data: categories,
  });
};
