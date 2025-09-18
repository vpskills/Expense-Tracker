import { ApiError } from '../../utils/ApiError.js';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from '../../utils/auth/generateTokens.js';
const prisma = new PrismaClient();
export const userSignin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError('All fields are required', 400);
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new ApiError('Invalid email or password!', 401);
    }
    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new ApiError('Invalid password', 401);
    }
    let accessToken, refreshToken;
    try {
        accessToken = generateAccessToken(user);
        refreshToken = generateRefreshToken(user);
    }
    catch {
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
//# sourceMappingURL=userSignin.js.map