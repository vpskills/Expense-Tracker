import { Router } from 'express';
import { getCategories } from '../controllers/categoriesController/getCategories.js';
const categoryRoute = Router();
categoryRoute.route('/get').get(getCategories);
export default categoryRoute;
//# sourceMappingURL=category.routes.js.map