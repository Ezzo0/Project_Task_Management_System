import { Router } from "express";
import {
  registerController,
  loginController,
  logoutController,
  refreshController,
} from "../controllers/auth.controller";
import { validateRequest } from "../middlewares/validate.middleware";
import {
  registerValidationRules,
  loginValidationRules,
} from "../validators/auth.validators";

export const authRouter = Router();

authRouter.post(
  "/register",
  registerValidationRules,
  validateRequest,
  registerController,
);

authRouter.post(
  "/login",
  loginValidationRules,
  validateRequest,
  loginController,
);

// Refresh access token using refresh token from cookie or body
authRouter.post("/refresh", refreshController);

// Logout route
authRouter.post("/logout", logoutController);
