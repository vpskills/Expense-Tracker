import type { Request, Response } from 'express';
import { ApiError } from '../../utils/ApiError.js';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from '../../utils/auth/generateTokens.js';
import { OAuth2Client } from 'google-auth-library';

const prisma = new PrismaClient();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

//////////////////////////
// Email/Password Login //
//////////////////////////
export const userSignin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError('All fields are required', 400);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new ApiError('Invalid email or password!', 401);
  }

  if (!user.password) {
    throw new ApiError('Login failed, Please login with Google or OAuth.', 401);
  }

  // Compare password
  const isPasswordValid = user.password ? await bcrypt.compare(password, user.password) : false;
  if (!isPasswordValid) {
    throw new ApiError('Invalid password', 401);
  }

  let accessToken, refreshToken;
  try {
    accessToken = generateAccessToken(user);
    refreshToken = generateRefreshToken(user);
  } catch {
    throw new ApiError('Failed to generate tokens', 500);
  }

  // Save refresh token in DB
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  res.status(200).json({
    message: 'Login successful',
    user: { id: user.id, name: user.name, email: user.email },
    accessToken,
    refreshToken,
  });
};

//////////////////////////
// Google OAuth Login  //
//////////////////////////
export const googleLogin = async (req: Request, res: Response) => {
  const { credential } = req.body;

  if (!credential) {
    throw new ApiError('Missing Google Credential', 400);
  }

  // Verify token with Google
  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID!,
  });

  const payload = ticket.getPayload();

  if (!payload?.email) {
    throw new ApiError('Invalid Google Token', 400);
  }

  // ✅ Find or create user in DB
  const user = await prisma.user.upsert({
    where: { email: payload.email },
    update: payload.name ? { name: payload.name } : {},
    create: {
      email: payload.email,
      name: payload.name ?? 'No Name',
      password: null,
    },
  });

  let accessToken, refreshToken;
  try {
    accessToken = generateAccessToken(user);
    refreshToken = generateRefreshToken(user);
  } catch {
    throw new ApiError('Failed to generate tokens', 500);
  }

  // Save refresh token in DB
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  res.status(200).json({
    message: 'Login successful',
    user: { id: user.id, name: user.name, email: user.email },
    accessToken,
    refreshToken,
  });
};
