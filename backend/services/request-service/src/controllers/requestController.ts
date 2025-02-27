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

  // To fetch all the requests to the Admin side
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
          .status(200)
          .json({ status: requestData.status, data: requestData.data });
      }
    } catch (error) {
      console.log("error in requestController", error);
    }
  };

  // To fetch all the redeem requests to the Admin side
  public getAllRedeemRequests = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const response = await this._requestService.getAllRedeemRequests();
      if (response.status) {
        res.status(200).json(response);
      } else {
        res.status(400).json(response);
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

  // To get request details for the user side
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
      const accessToken = req.headers["authorization"]?.split(" ")[1];
      if (!accessToken) {
        res.status(400).json({
          status: false,
          message: "Access Token Not Found",
        });
      }
      const decoded = jwtFunctions.verifyAccessToken(accessToken!);
      if (!decoded) {
        res.status(400).json({
          status: false,
          message: "Access Token Data Can't Get",
        });
      }

      const response = await this._requestService.getRequestDetails({
        requestId: req.body.requestId,
        userId: decoded?.id!,
        from: req.body.from
      });
      if (response.status) {
        res.status(200).json(response);
      } else {
        res.status(400).json(response);
      }
    } catch (error) {
      console.log("error in getRequestDetails/requestController", error);
    }
  };

  // To get request details for the admin side
  public adminGetRequestDetails = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const requestId = req.params.id;
      if (!requestId) {
        res.status(400).json({
          status: false,
          message:
            "Request Id not found on the adminGetRequestDetails Get Request",
        });
        return;
      }

      const response = await this._requestService.adminGetRequestDetails({
        requestId: requestId,
      });
      if (response.status) {
        res.status(200).json(response);
      } else {
        res.status(400).json(response);
      }
    } catch (error) {
      console.log("error in adminGetRequestDetails/requestController", error);
    }
  };

  // To cancel a Request
  public cancelRequest = async (req: Request, res: Response): Promise<void> => {
    try {
      const accessToken = req.headers["authorization"]?.split(" ")[1];
      if (!accessToken) {
        res.status(400).json({ message: "No authorization token provided" });
      } else {
        const decoded = await jwtFunctions.verifyAccessToken(accessToken);

        const response = await this._requestService.cancelRequest({
          requestId: req.body.requestId,
          userId: decoded?.id,
        });
        res.status(200).json(response);
      }
    } catch (error) {
      res
        .status(300)
        .json({ message: "error on the cancelRequest/requestController" });
    }
  };

  // To change the like status of request
  public changeLikeStatus = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      if (!req.body.requestId) {
        res.status(400).json({
          message: "Request Id Not Reached here on the changeLikeStatus",
        });
        return;
      }
      const accessToken = req.headers["authorization"]?.split(" ")[1];
      if (!accessToken) {
        res.status(400).json({ message: "No authorization token provided" });
      } else {
        const decoded = await jwtFunctions.verifyAccessToken(accessToken);

        const response = await this._requestService.changeLikeStatus({
          requestId: req.body.requestId,
          userId: decoded?.id
        });
        res.status(200).json(response);
      }
    } catch (error) {
      res
        .status(300)
        .json({ message: "error on the changeLikeStatus/requestController" });
    }
  };

  public createRedeemRequest = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const accessToken = req.headers["authorization"]?.split(" ")[1];
      if (!accessToken) {
        res.status(400).json({ message: "No authorization token provided" });
      } else {
        const decoded = await jwtFunctions.verifyAccessToken(accessToken);

        if (!decoded) {
          res
            .status(400)
            .json({ message: "Unable to decode the Access Token" });
        } else {
          const response = await this._requestService.createRedeemRequest({
            requestId: req.body.requestId,
            formData: req.body.formData,
            userId: decoded.id,
          });
          if (response.status) {
            res.status(200).json(response);
          } else {
            res.status(400).json(response);
          }
        }
      }
    } catch (error) {
      res
        .status(300)
        .json({ message: "error on the createRedeemRequest/adminController" });
    }
  };

  public getUserRedeemRequests = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const accessToken = req.headers["authorization"]?.split(" ")[1];
      if (!accessToken) {
        res.status(400).json({ message: "No authorization token provided" });
      } else {
        const decoded = await jwtFunctions.verifyAccessToken(accessToken);

        if (!decoded) {
          res
            .status(400)
            .json({ message: "Unable to decode the Access Token" });
        } else {
          const response = await this._requestService.getUserRedeemRequests({
            userId: decoded.id,
          });
          if (response.status) {
            res.status(200).json(response);
          } else {
            res.status(400).json(response);
          }
        }
      }
    } catch (error) {
      res
        .status(300)
        .json({ message: "error on the createRedeemRequest/adminController" });
    }
  };

  // To get the redeem request details for the user and admin
  public getRedeemRequestDetails = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      let requestRedeemId;
      if (req.body.requestRedeemId) {
        requestRedeemId = req.body.requestRedeemId;
      } else if (req.params.id) {
        requestRedeemId = req.params.id;
      }
      if (!requestRedeemId) {
        res.status(401).json({
          message:
            "requestRedeemId no getting on the the getRedeemRequestDetails/adminController",
        });
      } else {
        const response = await this._requestService.getRedeemRequestDetails({
          requestRedeemId,
        });
        if (response.status) {
          res.status(200).json(response);
        } else {
          res.status(400).json(response);
        }
      }
    } catch (error) {
      res.status(300).json({
        message: "error on the getRedeemRequestDetails/adminController",
      });
    }
  };

  // TO change the request status
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

  // To change the redeem request status
  public changeRedeemRequestStatus = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      console.log(req.body.Props);
      const { redeemRequestId, changeTo } = req.body.Props;
      if (!redeemRequestId || !changeTo) {
        res.status(401).json({
          message:
            "Data are missing from the body getRedeemRequestDetails/adminController",
        });
      }
      const response = await this._requestService.changeRedeemRequestStatus({
        redeemRequestId,
        changeTo,
      });

      if (response.status) {
        res.status(200).json(response);
      } else {
        res.status(400).json(response);
      }
    } catch (error) {
      res
        .status(300)
        .json({ message: "error on the changeUserStatus/adminController" });
    }
  };
}
