import { Request, Response, NextFunction } from "express";

import jwtFunctions from "../utils/jwt";
import jwtPayload from "../interface/IjwtPayload";
import { getUserById } from "../grpc/grpcClient";

interface decodedType {
  status: boolean;
  message: string;
  data: any;
}

const verifyAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    console.log(req, "this is the request data for the verify access token");
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ status: false, message: "Access Denied No Token" });
    }

    const decoded: jwtPayload | null = jwtFunctions.verifyAccessToken(token);

    if (decoded) {
      const liveUserData = await getUserById(decoded.id);
      if (liveUserData.status !== "active") {
        res.status(403).json({
          status: false,
          message: "Your account has been blocked. Please contact support.",
        });
      } else {
        next();
      }
    } else {
      throw new Error("invalid User Access Token");
    }
  } catch (error) {
    res.status(401).json({ status: false, message: "Invalid Token" });
  }
};

export default verifyAccessToken;

export const verifyAdminAccessToken = async (
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

    const decoded: jwtPayload | null =
      jwtFunctions.verifyAdminAccessToken(token);

    if (decoded) {
      next();
    } else {
      throw new Error("invalid Admin Access Token");
    }
  } catch (error) {
    res.status(401).json({ status: false, message: "Invalid Token" });
  }
};
