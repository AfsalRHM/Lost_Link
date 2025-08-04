import { NextFunction, Request, Response } from "express";

import { AppError } from "../utils/appError";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message =
    err instanceof AppError ? err.message : "Something went wrong";

  console.log("Error for the global Error handler", err);

  res.status(statusCode).json({ status: false, data: null, message });
};
