import { StatusCode } from "../constants/statusCodes";
import { AppError } from "./appError";

export function handleServiceError(
  error: unknown,
  fallbackMessage = "Internal server error"
): never {
  if (error instanceof AppError) {
    throw error;
  }

  throw new AppError(fallbackMessage, StatusCode.INTERNAL_SERVER_ERROR);
}
