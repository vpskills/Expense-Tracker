import { PrismaClient } from '@prisma/client';
import { ApiError } from '../../utils/ApiError.js';
const prisma = new PrismaClient();
export const addExpense = async (req, res) => {
    const { amount, description, categoryId, date } = req.body;
    if (!amount || !date) {
        throw new ApiError('All fields are required', 400);
    }
    // Normalize to YYYY-MM-DD
    const formattedDate = new Date(date).toISOString().split('T')[0];
    const expense = await prisma.expense.create({
        data: {
            amount: parseFloat(amount),
            description: description || null,
            date: formattedDate || "",
            userId: req.user.id,
            categoryId: categoryId || null,
        },
        include: { category: true },
    });
    if (!expense) {
        throw new ApiError('Failed to add expense', 500);
    }
    res.status(201).json({
        message: 'Expense added successfully',
        expense,
    });
};
//# sourceMappingURL=addExpense.js.map