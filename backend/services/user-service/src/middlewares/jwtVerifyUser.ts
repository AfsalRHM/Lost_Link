import { Request, Response, NextFunction } from "express";

import jwtFunctions from "../utils/jwt";

const verifyAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ status: false, message: "Access Denied No Token" });
    }

    const decoded = jwtFunctions.verifyAccessToken(token);
    if (!decoded) {
      return res
        .status(401)
        .json({ status: false, message: "Access Denied Access Token expired" });
    }
    (req as any).userData = decoded;
    next();
  } catch (error) {
    res.status(401).json({ status: false, message: "Invalid Token" });
  }
};

export default verifyAccessToken;
