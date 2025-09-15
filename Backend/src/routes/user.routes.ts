import { Router } from 'express';
import { userSignup } from '../controllers/usersController/userSignup.js';
import { userSignin } from '../controllers/usersController/userSignin.js';
import { getCurrentUser } from '../controllers/usersController/getUser.js';
import { verifyUser } from '../middleware/auth.middleware.js';

const userRoutes = Router();

userRoutes.route('/signup').post(userSignup);
userRoutes.route('/signin').post(userSignin);
userRoutes.route('/get-user').get(verifyUser, getCurrentUser);

export default userRoutes;
