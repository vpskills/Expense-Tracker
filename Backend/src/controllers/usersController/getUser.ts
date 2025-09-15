import type { Request, Response } from 'express';
import { type AuthRequest, verifyUser } from '../../middleware/auth.middleware.js';
import { ApiError } from '../../utils/ApiError.js';

export const getCurrentUser = (req: AuthRequest, res: Response) => {
  const user = req.user;

  if (!user) {
    throw new ApiError('unauthorized user!', 401);
  }

  res.status(200).json({
    message: 'Login successful',
    user: { id: user.id, name: user.name, email: user.email },
  });
};
