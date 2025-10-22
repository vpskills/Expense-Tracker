import { Router } from 'express';
import { verifyUser } from '../middleware/auth.middleware.js';
import { exportExpenses } from '../controllers/exportExpensesController/exportExpenses.js';

const exportRoute = Router();

exportRoute.route('/monthly-expenses').get(verifyUser, exportExpenses);

export default exportRoute;
