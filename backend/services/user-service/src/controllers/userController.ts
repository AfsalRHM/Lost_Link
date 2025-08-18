import { NextFunction, Request, Response } from "express";

import IuserController from "../interface/IuserController";
import IuserService from "../interface/IuserService";

import extractUserFromHeaders from "../utils/extractUserFromHeaders";
import { validationResult } from "express-validator";
import { StatusCode } from "../constants/statusCodes";
import { AppError } from "../utils/appError";

export default class UserController implements IuserController {
  private _userService: IuserService;

  constructor(userService: IuserService) {
    this._userService = userService;
  }

  public getProfile = async (
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

      const userData = await this._userService.getProfile({
        userId: user.id,
      });

      res
        .status(StatusCode.OK)
        .json({ status: true, message: "User data fectched", data: userData });
    } catch (error) {
      console.log("error in getUserData/userController", error);
      next(error);
    }
  };

  public getUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const page = parseInt(req.query.p as string) || 1;
      const limit = parseInt(req.query.l as string) || 2;
      const search = (req.query.s as string) || "";

      const users = await this._userService.getUsers({
        search,
        page,
        limit,
      });

      res.status(StatusCode.OK).json({
        status: true,
        data: users,
        message: "Fetched Users",
      });
    } catch (error) {
      console.log("error in getUsers/userController", error);
      next(error);
    }
  };

  public getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const users = await this._userService.getAllUsers();

      res.status(StatusCode.OK).json({
        status: true,
        data: users,
        message: "Fetched Users",
      });
    } catch (error) {
      console.log("error in getAllUsers/userController", error);
      next(error);
    }
  };

  public getUserData = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.params.id;
      if (!userId) {
        throw new AppError("User ID is required", StatusCode.BAD_REQUEST);
      }

      const userData = await this._userService.getUserData({ userId });

      res
        .status(StatusCode.OK)
        .json({ status: true, data: userData, message: "User data fetched" });
    } catch (error) {
      console.log("error in getUserData/userController", error);
      next(error);
    }
  };

  public updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(StatusCode.BAD_REQUEST).json({ errors: errors.array()[0] });
        return;
      }

      const formData = req.body.formData;
      if (!formData) {
        throw new AppError("Form Data is required", StatusCode.BAD_REQUEST);
      }

      const user = extractUserFromHeaders(req);
      if (!user || !user.id) {
        throw new AppError(
          "Unauthorized: User info missing",
          StatusCode.UNAUTHORIZED
        );
      }

      const userData = await this._userService.updateUser({
        updateFormData: formData,
        userId: user.id,
      });

      res
        .status(StatusCode.OK)
        .json({ status: true, data: userData, message: "User info updated" });
    } catch (error) {
      console.log("Erorr on the updateUser/userController", error);
      next(error);
    }
  };
}
