import type { User } from '@prisma/client';
import jwt, { type SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;
const accessExpiry = process.env.ACCESS_TOKEN_EXPIRY as SignOptions['expiresIn'];
const refreshExpiry = process.env.REFRESH_TOKEN_EXPIRY as SignOptions['expiresIn'];

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET || !accessExpiry || !refreshExpiry) {
  throw new Error('JWT environments missing::generateTokens.');
}

export const generateAccessToken = (user: User) => {
  const payload = { id: user.id, email: user.email, name: user.name };
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: accessExpiry || '2d' });
};

export const generateRefreshToken = (user: User) => {
  const payload = { id: user.id };
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: refreshExpiry || '7d' });
};