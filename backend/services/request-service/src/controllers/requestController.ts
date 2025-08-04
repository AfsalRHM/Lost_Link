import { NextFunction, Request, Response } from "express";

import IrequestController from "../interface/IrequestController";
import IrequestService from "../interface/IrequestService";

import { AppError } from "../utils/appError";
import extractUserFromHeaders from "../utils/extractUserFromHeaders";

import { StatusCode } from "../constants/statusCodes";
import { validationResult } from "express-validator";

export default class RequestController implements IrequestController {
  private _requestService: IrequestService;

  constructor(requestService: IrequestService) {
    this._requestService = requestService;
  }

  public createRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(StatusCode.OK).json({ errors: errors.array() });
        return;
      }

      const user = extractUserFromHeaders(req);
      if (!user || !user.id) {
        throw new AppError(
          "Unauthorized: User info missing",
          StatusCode.UNAUTHORIZED
        );
      }

      const formData = req.body.formData;
      if (!formData) {
        throw new AppError("Form Data is required", StatusCode.BAD_REQUEST);
      }

      const requestData = await this._requestService.insertRequest({
        userId: user.id,
        formData,
      });

      res.status(StatusCode.OK).json({
        status: true,
        data: requestData,
        message: "request created",
      });
    } catch (error) {
      console.log("error in createRequest/requestController", error);
      next(error);
    }
  };

  // To fetch all the requests to the Admin side
  public getAllRequests = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const requests = await this._requestService.getRequests();

      res.status(StatusCode.OK).json({
        status: true,
        data: requests,
        message: "All requests fetched",
      });
    } catch (error) {
      console.log("error in getAllRequest/requestController", error);
      next(error);
    }
  };

  // To fetch all the redeem requests to the Admin side
  public getAllRedeemRequests = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const redeemRequests = await this._requestService.getAllRedeemRequests();

      res.status(StatusCode.OK).json({
        status: true,
        data: redeemRequests,
        message: "All redeem requests fetched",
      });
    } catch (error) {
      console.log("error in getAllRedeemRequests/requestController", error);
      next(error);
    }
  };

  public managePayment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const formData = req.body.formData;
      if (!formData) {
        throw new AppError("form data is required", StatusCode.BAD_REQUEST);
      }

      const sessionId = await this._requestService.makePayment(formData);

      res.status(StatusCode.OK).json({
        status: true,
        data: sessionId,
        message: "Session for payment created ",
      });
    } catch (error) {
      console.log("error in managePayment/requestController", error);
      next(error);
    }
  };

  public getUserRequests = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.params.id;
      if (!userId) {
        throw new AppError("userId is required", StatusCode.BAD_REQUEST);
      }

      const requests = await this._requestService.getUserRequests(userId);

      res.status(StatusCode.OK).json({
        status: true,
        data: requests,
        message: "Fetched all user's requests",
      });
    } catch (error) {
      console.log("error in getUserRequests/requestController", error);
      next(error);
    }
  };

  // To get request details for the user side
  public getRequestDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { requestId, from } = req.body;
      if (!requestId || !from) {
        throw new AppError(
          "requestId and from(data) is required",
          StatusCode.BAD_REQUEST
        );
      }

      const user = extractUserFromHeaders(req);
      if (!user || !user.id) {
        throw new AppError(
          "Unauthorized: User info missing",
          StatusCode.UNAUTHORIZED
        );
      }

      const data = await this._requestService.getRequestDetails({
        requestId: req.body.requestId,
        userId: user.id,
        from: req.body.from,
      });

      res
        .status(StatusCode.OK)
        .json({ status: true, data, message: "request details fetched" });
    } catch (error) {
      console.log("error in getRequestDetails/requestController", error);
      next(error);
    }
  };

  // To get request details for the admin side
  public adminGetRequestDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const requestId = req.params.id;
      if (!requestId) {
        throw new AppError("requestId and is required", StatusCode.BAD_REQUEST);
      }

      const data = await this._requestService.adminGetRequestDetails({
        requestId: requestId,
      });

      res
        .status(StatusCode.OK)
        .json({ status: true, data, message: "request details fetched" });
    } catch (error) {
      console.log("error in adminGetRequestDetails/requestController", error);
      next(error);
    }
  };

  // To cancel a Request
  public cancelRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log(req.params);
      console.log(req.body);
      const requestId = req.params.id;
      const from = req.body.from ? req.body.from : "user";
      if (!requestId || !from) {
        throw new AppError(
          "requestId and from is required",
          StatusCode.BAD_REQUEST
        );
      }

      const user = extractUserFromHeaders(req);
      if (!user || !user.id) {
        throw new AppError(
          "Unauthorized: User info missing",
          StatusCode.UNAUTHORIZED
        );
      }

      const requestData = await this._requestService.cancelRequest({
        requestId,
        userId: from == "admin" ? "admin" : user.id,
      });

      res.status(StatusCode.OK).json({
        status: true,
        data: requestData,
        message: `Request cancelled successfully`,
      });
    } catch (error) {
      console.log("error on the cancelRequest/requestController");
      next(error);
    }
  };

  // To change the like status of request
  public changeLikeStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const requestId = req.params.id;
      if (!requestId) {
        throw new AppError("requestId is required", StatusCode.BAD_REQUEST);
      }

      const user = extractUserFromHeaders(req);
      if (!user || !user.id) {
        throw new AppError(
          "Unauthorized: User info missing",
          StatusCode.UNAUTHORIZED
        );
      }

      const requestData = await this._requestService.changeLikeStatus({
        requestId,
        userId: user.id,
      });

      res.status(StatusCode.OK).json({
        status: true,
        data: requestData,
        message: "request updated with like count",
      });
    } catch (error) {
      console.log("error on the changeLikeStatus/requestController");
      next(error);
    }
  };

  public createRedeemRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { requestId, formData } = req.body;
      if (!requestId || !formData) {
        throw new AppError("requestId and formData is required");
      }

      const user = extractUserFromHeaders(req);
      if (!user || !user.id) {
        throw new AppError(
          "Unauthorized: User info missing",
          StatusCode.UNAUTHORIZED
        );
      }

      const redeemRequest = await this._requestService.createRedeemRequest({
        requestId,
        formData,
        userId: user.id,
      });

      res.status(StatusCode.OK).json({
        status: true,
        data: redeemRequest,
        message: "redeem request inserted",
      });
    } catch (error) {
      console.log("error on the createRedeemRequest/adminController");
      next(error);
    }
  };

  public getUserRedeemRequests = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = extractUserFromHeaders(req);
      if (!user || !user.id) {
        throw new AppError(
          "Unauthorized: User info missing",
          StatusCode.UNAUTHORIZED
        );
      }

      const redeemRequests = await this._requestService.getUserRedeemRequests({
        userId: user.id,
      });

      res.status(StatusCode.OK).json({
        status: true,
        data: redeemRequests,
        message: "fetched user's redeem requests",
      });
    } catch (error) {
      console.log("error on the getUserRedeemRequests/adminController");
      next(error);
    }
  };

  // To get the redeem request details for the user and admin
  public getRedeemRequestDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const redeemRequestId = req.params.id;
      if (!redeemRequestId) {
        throw new AppError(
          "redeemRequestId is required",
          StatusCode.BAD_REQUEST
        );
      }

      const redeemRequest = await this._requestService.getRedeemRequestDetails({
        redeemRequestId,
      });

      res.status(StatusCode.OK).json({
        status: true,
        data: redeemRequest,
        message: "redeem request details fetched",
      });
    } catch (error) {
      console.log("error on the getRedeemRequestDetails/adminController");
      next(error);
    }
  };

  // TO change the request status
  public changeRequestStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const requestId = req.params.id;
      if (!requestId) {
        throw new AppError("requestId is required", StatusCode.BAD_REQUEST);
      }

      const requestData = await this._requestService.changeRequestStatus({
        requestId,
      });

      res.status(StatusCode.OK).json({
        status: true,
        data: requestData,
        message: "request status updated",
      });
    } catch (error) {
      console.log("error on the changeUserStatus/adminController");
      next(error);
    }
  };

  // To change the redeem request status
  public changeRedeemRequestStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { redeemRequestId, changeTo } = req.body;
      if (!redeemRequestId || !changeTo) {
        throw new AppError(
          "requestId and changeTo(body) is required",
          StatusCode.BAD_REQUEST
        );
      }

      const data = await this._requestService.changeRedeemRequestStatus({
        redeemRequestId,
        changeTo,
      });

      res.status(StatusCode.OK).json({
        status: true,
        data,
        message: "redeem request status updated",
      });
    } catch (error) {
      console.log("error on the changeUserStatus/adminController");
      next(error);
    }
  };
}
