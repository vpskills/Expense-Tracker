import { PrismaClient } from '@prisma/client';
import { ApiError } from '../../utils/ApiError.js';
import type { Response } from 'express';
import type { AuthRequest } from '../../middleware/auth.middleware.js'; // use your own type

const prisma = new PrismaClient();

export const addCategory = async (req: AuthRequest, res: Response) => {
  const user = req.user;
  const { emoji, label } = req.body;

  if (!user) {
    throw new ApiError('unauthorized user!', 401);
  }

  if (!label?.trim()) {
    throw new ApiError('Category label is required', 400);
  }

  // Check if same label already exists (for same user or default/global)
  const existingCategory = await prisma.category.findFirst({
    where: {
      label: {
        equals: label,
        mode: 'insensitive',
      },
      OR: [{ userId: user?.id }, { userId: null }],
    },
  });

  if (existingCategory) {
    throw new ApiError('Category with this label already exists', 400);
  }

  // Create category
  try {
    const category = await prisma.category.create({
      data: {
        label: label.trim(),
        emoji: emoji || "⭕️",
        userId: user?.id,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    throw new ApiError('Error creting category', 500);
  }
};
