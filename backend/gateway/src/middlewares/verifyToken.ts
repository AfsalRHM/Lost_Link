import { Request, Response, NextFunction } from "express";

import { verifyAccessToken } from "../utils/jwt";
import STATUS_CODE from "../constants/statusCodes";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res
        .status(STATUS_CODE.UNAUTHORIZED)
        .json({ message: "Authorization token missing" });
      return;
    }

    const token = authHeader.split(" ")[1];

    const decoded = verifyAccessToken({ token });
    if (!decoded) {
      res
        .status(STATUS_CODE.UNAUTHORIZED)
        .json({ status: false, message: "Invalid or expired token" });
      return;
    }

    req.headers["x-user-payload"] = JSON.stringify(decoded);

    next();
  } catch (err) {
    res.status(STATUS_CODE.FORBIDDEN).json({ message: "Unauthorized access" });
    return;
  }
};
