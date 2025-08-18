import { NextFunction, Request, Response } from "express";

import IadminController from "../interface/IadminController";
import IadminService from "../interface/IadminService";

import { StatusCode } from "../constants/statusCodes";
import { AppError } from "../utils/appError";

export default class AdminController implements IadminController {
  private _adminService: IadminService;

  constructor(adminService: IadminService) {
    this._adminService = adminService;
  }

  public adminLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw new AppError(
          "email and password is required",
          StatusCode.BAD_REQUEST
        );
      }

      const response = await this._adminService.adminLogin({ email, password });

      const accessToken = response.accessToken;
      const refreshToken = response.refreshToken;

      res
        .status(StatusCode.OK)
        .cookie("adminRefreshToken", refreshToken, {
          httpOnly: true,
          sameSite: "strict",
          path: "/",
        })
        .setHeader("Authorization", `Bearer ${accessToken}`)
        .json({
          status: true,
          message: "Login Successfull",
          data: response,
          accessToken,
        });
    } catch (error) {
      console.log("error on the adminLogin/adminController");
      next(error);
    }
  };

  public getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const users = await this._adminService.getAllUsers();

      res
        .status(StatusCode.OK)
        .json({ status: true, data: users, message: "Fetched users" });
    } catch (error) {
      console.log("error on the getAllUsers/adminController");
      next(error);
    }
  };

  public getAdmins = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const page = parseInt(req.query.p as string) || 1;
      const limit = parseInt(req.query.l as string) || 2;
      const search = (req.query.s as string) || "";

      const admins = await this._adminService.getAdmins({
        search,
        page,
        limit,
      });

      res.status(StatusCode.OK).json({
        status: true,
        data: admins,
        message: "Fetched admins",
      });
    } catch (error) {
      console.log("error on the getAdmins/adminController");
      next(error);
    }
  };

  public changeUserStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.params.id;
      if (!userId) {
        throw new AppError("userId is required", StatusCode.BAD_REQUEST);
      }

      const userData = await this._adminService.changeUserStatus({ userId });

      res
        .status(StatusCode.OK)
        .json({ status: true, data: userData, message: "Updated user status" });
    } catch (error) {
      console.log("error on the changeUserStatus/adminController");
      next(error);
    }
  };

  public changeAdminStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const adminId = req.params.id;
      if (!adminId) {
        throw new AppError("adminId is required", StatusCode.BAD_REQUEST);
      }

      await this._adminService.changeAdminStatus({ adminId });

      res
        .status(StatusCode.OK)
        .json({ status: true, data: null, message: "Updated admin status" });
    } catch (error) {
      console.log("error on the changeAdminStatus/adminController");
      next(error);
    }
  };

  public insertAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, name, role, password } = req.body;
      if (!email || !name || !role || !password) {
        throw new AppError(
          "email, name, role and password is required",
          StatusCode.BAD_REQUEST
        );
      }

      const admin = await this._adminService.insertAdmin({
        email,
        name,
        role,
        password,
      });

      res
        .status(StatusCode.OK)
        .json({ status: true, data: admin, message: "Admin created" });
    } catch (error) {
      console.log("error on the insertAdmin/adminController");
      next(error);
    }
  };

  public adminLogout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      res
        .status(StatusCode.OK)
        .clearCookie("adminRefreshToken", {
          httpOnly: true,
          sameSite: "strict",
          path: "/",
        })
        .json({ status: "true", message: "Logged out successfully" });
    } catch (error) {
      console.log("error on the adminLogout/adminController");
      next(error);
    }
  };

  public refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const refreshToken = req.cookies.adminRefreshToken;
      if (!refreshToken) {
        throw new AppError(
          "Unauthorized: Refresh token missing",
          StatusCode.UNAUTHORIZED
        );
      }

      const newAccessToken = await this._adminService.refreshToken({
        token: refreshToken,
      });

      res
        .setHeader("Authorization", `Bearer ${newAccessToken}`)
        .status(StatusCode.OK)
        .json({
          status: true,
          message: "New Access Token Created",
          accessToken: newAccessToken,
        });
    } catch (error) {
      console.log("error on the refreshToken/adminController");
      next(error);
    }
  };
}
