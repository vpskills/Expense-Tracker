import { PrismaClient } from '@prisma/client';
import { ApiError } from '../../utils/ApiError.js';
const prisma = new PrismaClient();
export const getCategories = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const categories = await prisma.category.findMany({
        skip,
        take: limit,
        orderBy: { label: 'asc' },
    });
    if (!categories || categories.length === 0) {
        throw new ApiError('No categories found', 404);
    }
    res.status(200).json({
        success: true,
        count: categories?.length,
        data: categories,
    });
};
//# sourceMappingURL=getCategories.js.map