import { Request, Response } from "express";
import IrequestController from "../interface/IrequestController";

import requestService from "../services/requestService";
import { validationResult } from "express-validator";
import jwtFunctions from "../utils/jwt";

export default class RequestController implements IrequestController {
  private _requestService: requestService;

  constructor() {
    this._requestService = new requestService();
  }

  public createRequest = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("here reaching after the validation");
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

  public getAllRequests = async (
    req: Request,
    res: Response
  ): Promise<void> => {
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

  public managePayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const accessToken = req.headers["authorization"]?.split(" ")[1];
      if (!accessToken) {
        res.status(400).json({ message: "No authorization token provided" });
      } else {
        const { formData } = req.body;
        const responseData = await this._requestService.makePayment(formData);
        res
          .setHeader("Authorization", `Bearer ${accessToken}`)
          .status(200)
          .json({ status: responseData.status, data: responseData.data });
      }
    } catch (error) {
      console.log("error in requestController", error);
    }
  };

  public getUserRequests = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      if (!req.body.userRequests) {
        res.status(400).json({
          status: false,
          message: "No User Requests found on the getUserRequests Post Request",
        });
        return;
      }
      const response = await this._requestService.getUserRequests(
        req.body.userRequests
      );
      if (response.status) {
        res.status(200).json(response);
      } else {
        res.status(400).json(response);
      }
    } catch (error) {
      console.log("error in requestController", error);
    }
  };

  public getRequestDetails = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      if (!req.body.requestId) {
        res.status(400).json({
          status: false,
          message: "Request Id not found on the getRequestDetails Post Request",
        });
        return;
      }
      const response = await this._requestService.getRequestDetails(
        req.body.requestId
      );
      if (response.status) {
        res.status(200).json(response);
      } else {
        res.status(400).json(response);
      }
    } catch (error) {
      console.log("error in getRequestDetails/requestController", error);
    }
  };

  public cancelRequest = async (req: Request, res: Response): Promise<void> => {
    try {
      const accessToken = req.headers["authorization"]?.split(" ")[1];
      if (!accessToken) {
        res.status(400).json({ message: "No authorization token provided" });
      } else {
        const decoded = await jwtFunctions.verifyAccessToken(accessToken);

        console.log("Request Id 2", req.body, decoded);

        const response = await this._requestService.cancelRequest({
          requestId: req.body.requestId,
          userId: decoded?.id,
        });
        res.status(200).json(response);
      }
    } catch (error) {
      res
        .status(300)
        .json({ message: "error on the cancelRequest/adminController" });
    }
  };

  public createRedeemRequest = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const response = await this._requestService.createRedeemRequest({
        requestId: req.body.requestId,
        formData: req.body.formData,
      });
      if (response.status) {
        res.status(200).json(response);
      } else {
        res.status(400).json(response);
      }
    } catch (error) {
      res
        .status(300)
        .json({ message: "error on the createRedeemRequest/adminController" });
    }
  };

  public changeRequestStatus = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const accessToken = req.headers["authorization"]?.split(" ")[1];
      if (!accessToken) {
        res.status(400).json({ message: "No authorization token provided" });
      } else {
        const response = await this._requestService.changeRequestStatus(
          req.body.Props
        );
        res
          .setHeader("Authorization", `Bearer ${accessToken}`)
          .status(200)
          .json(response);
      }
    } catch (error) {
      res
        .status(300)
        .json({ message: "error on the changeUserStatus/adminController" });
    }
  };
}
