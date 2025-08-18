import { Request, Response, NextFunction } from "express";

import { getAdminById, getUserById } from "../grpc/grpcClient";

import extractUserFromHeaders from "../utils/extractUserFromHeaders";
import { AppError } from "../utils/appError";

import { StatusCode } from "../constants/statusCodes";

export const isUserBlocked = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const user = extractUserFromHeaders(req);
    if (!user || !user.id) {
      throw new AppError(
        "Unauthorized: User info missing",
        StatusCode.UNAUTHORIZED
      );
    }

    const livedata = await getUserById(user.id);
    if (livedata.status !== "active") {
      res.status(403).json({
        status: false,
        message: "Account Blocked",
      });
      return;
    }

    next();
  } catch (error) {
    res
      .status(401)
      .json({ status: false, message: "Unauthrorized Access Detected" });
  }
};

export const isAdminBlocked = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const user = extractUserFromHeaders(req);
    if (!user || !user.id) {
      throw new AppError(
        "Unauthorized: Admin info missing",
        StatusCode.UNAUTHORIZED
      );
    }

    const livedata = await getAdminById(user.id);
    if (livedata.status !== "active") {
      res.status(403).json({
        status: false,
        message: "Account Blocked",
      });
      return;
    }

    next();
  } catch (error) {
    res
      .status(401)
      .json({ status: false, message: "Unauthrorized Access Detected" });
  }
};
