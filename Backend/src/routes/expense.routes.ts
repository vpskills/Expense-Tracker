import { Router } from 'express';
import { verifyUser } from '../middleware/auth.middleware.js';
import { addExpense } from '../controllers/expensesController/addExpense.js';
import { getExpenses } from '../controllers/expensesController/getExpenses.js';
import { deleteSingleExpense } from '../controllers/expensesController/deleteExpense.js';
import { getFullYearSummary, getMonthlySummary } from '../controllers/expensesController/summary.js';

const expensesRoute = Router();

expensesRoute.route('/add').post(verifyUser, addExpense);
expensesRoute.route('/get').get(verifyUser, getExpenses);
expensesRoute.route('/delete').delete(verifyUser, deleteSingleExpense);
expensesRoute.route('/summary/month').get(verifyUser, getMonthlySummary);
expensesRoute.route('/summary/year').get(verifyUser, getFullYearSummary);

export default expensesRoute;
