import { Request, Response } from "express";
import IuserController from "../interface/IuserController";
import userModel from "../models/userModel";
import jwtFunctions from "../utils/jwt";

export default class UserController implements IuserController {
  public getProfile = async (req: Request, res: Response): Promise<void> => {
    const accessToken = req.headers["authorization"]?.split(" ")[1];
    if (!accessToken) {
      res.status(400).json({ message: "No authorization token provided" });
    } else {
      const decoded = jwtFunctions.verifyAccessToken(accessToken);
      const userData = await userModel.findOne({ _id: decoded?.userId });
      res
        .setHeader("Authorization", `Bearer ${accessToken}`)
        .status(200)
        .json({ status: true, data: userData });
    }
  };
}
