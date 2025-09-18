import { ApiError } from '../utils/ApiError.js';
export const errorHandler = (err, req, res, next) => {
    console.error(err);
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({ message: err.message });
    }
    res.status(500).json({ message: 'Internal server error' });
};
//# sourceMappingURL=errorHandler.middleware.js.map