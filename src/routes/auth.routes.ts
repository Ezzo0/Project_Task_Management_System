import { Router } from "express";
import {
  registerController,
  loginController,
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
