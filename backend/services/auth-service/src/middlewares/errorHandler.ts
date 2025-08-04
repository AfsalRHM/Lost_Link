import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError";

export const globalErrorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = "Something went wrong";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  console.error("🔥 Global Error Handler:", {
    message: err instanceof Error ? err.message : err,
    stack: err instanceof Error ? err.stack : null,
  });

  res.status(statusCode).json({
    status: false,
    data: null,
    message,
  });
};
