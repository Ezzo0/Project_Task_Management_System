import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Convert thrown errors into a consistent HTTP response format.
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({ message });
};
