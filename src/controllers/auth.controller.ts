import { Request, Response, NextFunction } from "express";
import { loginUser, registerUser } from "../services/auth.service";

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, password } = req.body;
    const user = await registerUser(name, email, password);
    res.status(201).json({ id: user.id, name: user.name, email: user.email });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    res.json({
      token: result.token,
    });
  } catch (error) {
    next(error);
  }
};
