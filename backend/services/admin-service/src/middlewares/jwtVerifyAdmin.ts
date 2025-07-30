import { Request, Response, NextFunction } from "express";

// import jwtFunctions from "../utils/jwt";
import { jwtPayload } from "../interface/IjwtTypes";
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

    const decoded: jwtPayload | null =
      jwtFunctions.verifyAdminAccessToken(token);

    if (decoded) {
      next();
    } else {
      throw new Error("invalid Access Token");
    }
  } catch (error) {
    console.log("Error on the Access Token Middleware", error);
    res.status(401).json({ status: false, message: "Invalid Token" });
  }
};

export default verifyAccessToken;
