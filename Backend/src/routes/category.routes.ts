import { Router } from 'express';
import { getCategories } from '../controllers/categoriesController/getCategories.js';
import { verifyUser } from '../middleware/auth.middleware.js';
import { addCategory } from '../controllers/categoriesController/addCategories.js';
import { deleteUserSpecificCategory } from '../controllers/categoriesController/deleteCategories.js';

const categoryRoute = Router();

categoryRoute.route('/get').get(verifyUser, getCategories);
categoryRoute.route('/add').post(verifyUser, addCategory);
categoryRoute.route('/remove').delete(verifyUser, deleteUserSpecificCategory);

export default categoryRoute;
