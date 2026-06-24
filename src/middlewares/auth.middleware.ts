import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../utils/payload";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Validate that the request includes a Bearer token in Authorization header.
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token missing or invalid" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret",
    ) as JwtPayload;
    // Attach authenticated user details to the request for downstream handlers.
    (req as any).userId = payload.userId;
    (req as any).userRole = payload.role;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
