import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError.js';
export declare const errorHandler: (err: Error | ApiError, req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=errorHandler.middleware.d.ts.map