import type { Request, Response, NextFunction } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
    name?: string;
  };
}

export const verifyUser = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    throw new ApiError('No token provided', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload;
    req.user = {
      id: decoded.id as string,
      email: decoded.email as string,
      name: decoded.name as string,
    };
    next();
  } catch (error) {
    throw new ApiError('Invalid or expired token', 403);
  }
};
