import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from '../../utils/auth/generateTokens.js';
import { ApiError } from '../../utils/ApiError.js';
const prisma = new PrismaClient();
export const userSignup = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        throw new ApiError('All fields are required', 400);
    }
    if (password.length < 6) {
        throw new ApiError('Password must be at least 6 characters', 400);
    }
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new ApiError('Email already in use', 400);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: { name, email, password: hashedPassword },
    });
    let accessToken, refreshToken;
    try {
        accessToken = generateAccessToken(user);
        refreshToken = generateRefreshToken(user);
    }
    catch (tokenError) {
        throw new ApiError('Failed to generate tokens', 500);
    }
    await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
    });
    res.status(201).json({
        message: 'User created successfully',
        user: { id: user.id, name: user.name, email: user.email },
        accessToken,
        refreshToken,
    });
};
//# sourceMappingURL=userSignup.js.map