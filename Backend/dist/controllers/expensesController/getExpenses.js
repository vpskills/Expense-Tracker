import { ApiError } from '../../utils/ApiError.js';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export const getExpenses = async (req, res) => {
    const userId = req.user?.id;
    const { date } = req.query;
    if (!userId) {
        throw new ApiError('Unauthorized user!', 401);
    }
    if (!date) {
        throw new ApiError('Date query parameter is required (YYYY-MM-DD)', 400);
    }
    const normalizedDate = new Date(date).toISOString().split('T')[0];
    const expenses = await prisma.expense.findMany({
        where: {
            userId,
            date: normalizedDate || '',
        },
        include: { category: true },
        orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({
        message: 'Expenses fetched successfully',
        expenses,
    });
};
//# sourceMappingURL=getExpenses.js.map