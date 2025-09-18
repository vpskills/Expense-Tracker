import { Router } from 'express';
import { verifyUser } from '../middleware/auth.middleware.js';
import { addExpense } from '../controllers/expensesController/addExpense.js';
import { getExpenses } from '../controllers/expensesController/getExpenses.js';
const expensesRoute = Router();
expensesRoute.route('/add').post(verifyUser, addExpense);
expensesRoute.route('/get').get(verifyUser, getExpenses);
export default expensesRoute;
//# sourceMappingURL=expense.routes.js.map