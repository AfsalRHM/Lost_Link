import { Request, Response } from "express";
import IuserController from "../interface/IuserController";
import jwtFunctions from "../utils/jwt";

import userService from "../services/userService";
import jwtPayload from "../interface/IjwtPayload";
import { validationResult } from "express-validator";
import { StatusCode } from "../constants/statusCodes";

export default class UserController implements IuserController {
  private _userService: userService;

  constructor() {
    this._userService = new userService();
  }

  public getProfile = async (req: Request, res: Response): Promise<void> => {
    const accessToken = req.headers["authorization"]?.split(" ")[1];
    if (!accessToken) {
      res
        .status(StatusCode.BAD_REQUEST)
        .json({ message: "No authorization token provided" });
    } else {
      const decoded: jwtPayload | null =
        jwtFunctions.verifyAccessToken(accessToken);
      if (!decoded) {
        res
          .status(StatusCode.BAD_REQUEST)
          .json({ message: "No authorization token provided" });
      } else {
        const response = await this._userService.getProfile({
          userId: decoded.id,
        });
        if (response.status) {
          res
            .setHeader("Authorization", `Bearer ${accessToken}`)
            .status(StatusCode.OK)
            .json({
              status: true,
              data: response.data,
              message: response.message,
            });
        } else {
          res
            .setHeader("Authorization", `Bearer ${accessToken}`)
            .status(StatusCode.OK)
            .json({ status: false, data: null, message: response.message });
        }
      }
    }
  };

  public getAllUsers = async (req: Request, res: Response): Promise<void> => {
    const accessToken = req.headers["authorization"]?.split(" ")[1];
    if (!accessToken) {
      res
        .status(StatusCode.BAD_REQUEST)
        .json({ message: "No authorization token provided" });
    } else {
      const response = await this._userService.getAllUsers();
      if (response.status) {
        res
          .setHeader("Authorization", `Bearer ${accessToken}`)
          .status(StatusCode.OK)
          .json({
            status: true,
            data: response.data,
            message: response.message,
          });
      } else {
        res
          .setHeader("Authorization", `Bearer ${accessToken}`)
          .status(StatusCode.OK)
          .json({
            status: false,
            data: response.data,
            message: response.message,
          });
      }
    }
  };

  public getUserData = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.id;
      if (!userId) {
        throw new Error("User Id not passed correctly through params");
      }

      const response = await this._userService.getUserData({ userId });

      if (response.status) {
        res.status(StatusCode.OK).json(response);
      } else {
        if (response.message == "Invalid Request ID format") {
          res.status(StatusCode.NOT_FOUND).json(response);
        } else {
          res.status(StatusCode.BAD_REQUEST).json(response);
        }
      }
    } catch (error) {
      console.log("error in getUserData/userController", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        status: false,
        data: null,
        message: "Erorr on the getUserData/userController",
      });
    }
  };

  public updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(StatusCode.BAD_REQUEST).json({ errors: errors.array()[0] });
      } else {
        const accessToken = req.headers["authorization"]?.split(" ")[1];
        if (!accessToken) {
          res
            .status(StatusCode.BAD_REQUEST)
            .json({ message: "No authorization token provided" });
        } else if (!req.body.formData) {
          res.status(StatusCode.NOT_FOUND).json({
            status: false,
            data: null,
            message: "The form data not found on the updateUser/userController",
          });
        } else {
          const decoded = jwtFunctions.verifyAccessToken(accessToken);
          if (!decoded) {
            throw new Error(
              "Decoded value is not getting on the the updateUser/userController"
            );
          } else {
            const response = await this._userService.updateUser({
              updateFormData: req.body.formData,
              userId: decoded.id,
            });
            if (response.status) {
              res.status(StatusCode.OK).json({
                status: response.status,
                data: response.data,
                message: response.message,
              });
            } else {
              res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
                status: false,
                data: null,
                message: response.message,
              });
            }
          }
        }
      }
    } catch (error) {
      console.log("Erorr on the updateUser/userController", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        status: false,
        data: null,
        message: "Erorr on the updateUser/userController",
      });
    }
  };
}
