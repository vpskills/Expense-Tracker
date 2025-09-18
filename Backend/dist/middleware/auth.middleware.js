import jwt, {} from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
export const verifyUser = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        throw new ApiError('No token provided', 401);
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = {
            id: decoded.id,
            email: decoded.email,
            name: decoded.name,
        };
        next();
    }
    catch (error) {
        throw new ApiError('Invalid or expired token', 403);
    }
};
//# sourceMappingURL=auth.middleware.js.map