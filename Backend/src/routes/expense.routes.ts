import { Router } from 'express';
import { verifyUser } from '../middleware/auth.middleware.js';
import { addExpense } from '../controllers/expensesController/addExpense.js';

const expensesRoute = Router();

expensesRoute.route('/add').post(verifyUser, addExpense);

export default expensesRoute;
