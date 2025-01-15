import { Request, Response } from "express";
import IrequestController from "../interface/IrequestController";
import requestModel from "../models/requestModel";

import requestService from "../services/requestService";

export default class RequestController implements IrequestController {
  private _requestService: requestService;

  constructor() {
    this._requestService = new requestService();
  }

  public getProfile = async (req: Request, res: Response): Promise<void> => {
//     const accessToken = req.headers["authorization"]?.split(" ")[1];
//     if (!accessToken) {
//       res.status(400).json({ message: "No authorization token provided" });
//     } else {
//       const decoded = jwtFunctions.verifyAccessToken(accessToken);
//       const userData = await userModel.findOne({ _id: decoded?.userId });
//       res
//         .setHeader("Authorization", `Bearer ${accessToken}`)
//         .status(200)
//         .json({ status: true, data: userData });
//     }
  };
}
