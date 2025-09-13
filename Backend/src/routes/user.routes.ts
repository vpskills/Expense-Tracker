import { Router } from "express";
import { userSignup } from "../controllers/usersController/userSignup.js";
import { userSignin } from "../controllers/usersController/userSignin.js";

const userRoutes = Router();

userRoutes.route("/signup").post(userSignup);
userRoutes.route("/signin").post(userSignin);

export default userRoutes;