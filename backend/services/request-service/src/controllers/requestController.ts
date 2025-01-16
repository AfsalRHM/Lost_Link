import { Request, Response } from "express";
import IrequestController from "../interface/IrequestController";

import requestService from "../services/requestService";
import { validationResult } from "express-validator";

export default class RequestController implements IrequestController {
  private _requestService: requestService;

  constructor() {
    this._requestService = new requestService();
  }

  public createRequest = async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }
      const accessToken = req.headers["authorization"]?.split(" ")[1];
      if (!accessToken) {
        res.status(400).json({ message: "No authorization token provided" });
      } else {
        const formData = req.body;
        const requestData = await this._requestService.insertRequest({
          accessToken,
          formData,
        });

        res
          .setHeader("Authorization", `Bearer ${accessToken}`)
          .status(200)
          .json({ status: requestData.status, data: requestData.data });
      }
    } catch (error) {
      console.log("error in requestController", error);
    }
  };

  public getAllRequests = async (req: Request, res: Response): Promise<void> => {
    try {
      const accessToken = req.headers["authorization"]?.split(" ")[1];
      if (!accessToken) {
        res.status(400).json({ message: "No authorization token provided" });
      } else {
        const requestData = await this._requestService.getRequests();

        res
          .setHeader("Authorization", `Bearer ${accessToken}`)
          .status(200)
          .json({ status: requestData.status, data: requestData.data });
      }
    } catch (error) {
      console.log("error in requestController", error);
    }
  };
}
