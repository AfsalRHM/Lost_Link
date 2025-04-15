import { Request, Response } from "express";
import IadminController from "../interface/IadminController";
import adminService from "../services/adminService";
import { StatusCode } from "../constants/statusCodes";

export default class authController implements IadminController {
  private _adminService: adminService;

  constructor() {
    this._adminService = new adminService();
  }

  public adminLogin = async (req: Request, res: Response): Promise<void> => {
    const response = await this._adminService.adminLogin(req.body);
    if (response.status) {
      const accessToken = response.tokenData?.accessToken;
      const refreshToken = response.tokenData?.refreshToken;

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
          data: response.data,
          accessToken,
        });
    } else {
      res
        .status(StatusCode.OK)
        .json({ status: false, message: "Login Failed", data: null });
    }
  };

  public getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const response = await this._adminService.getAllUsers();
      res.status(StatusCode.OK).json(response);
    } catch (error) {
      res
        .status(StatusCode.BAD_REQUEST)
        .json({ message: "error on the getAllUsers/adminController" });
    }
  };

  public getAllAdmins = async (req: Request, res: Response): Promise<void> => {
    try {
      const response = await this._adminService.getAllAdmins();
      res.status(StatusCode.OK).json(response);
    } catch (error) {
      res
        .status(StatusCode.BAD_REQUEST)
        .json({ message: "error on the getAllAdmins/adminController" });
    }
  };

  public changeUserStatus = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const response = await this._adminService.changeUserStatus(
        req.body.Props
      );
      res.status(StatusCode.OK).json(response);
    } catch (error) {
      res
        .status(StatusCode.BAD_REQUEST)
        .json({ message: "error on the changeUserStatus/adminController" });
    }
  };

  public changeAdminStatus = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const response = await this._adminService.changeAdminStatus(
        req.body.Props
      );
      res.status(StatusCode.OK).json(response.data);
    } catch (error) {
      res
        .status(StatusCode.BAD_REQUEST)
        .json({ message: "error on the changeAdminStatus/adminController" });
    }
  };

  public insertAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
      const response = await this._adminService.insertAdmin(req.body.Props);
      res.status(StatusCode.OK).json(response.data);
    } catch (error) {
      res
        .status(StatusCode.BAD_REQUEST)
        .json({ message: "error on the insertAdmin/adminController" });
    }
  };

  public adminLogout = async (req: Request, res: Response): Promise<void> => {
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
      res
        .status(StatusCode.BAD_REQUEST)
        .json({ message: "error on the adminLogout/adminController" });
    }
  };

  public refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("Reaching here on the admin refreshTOken/adminController");
      const refreshToken = req.cookies.adminRefreshToken;
      const result = await this._adminService.refreshToken(refreshToken);
      if (result?.status == true) {
        res
          .setHeader("Authorization", `Bearer ${result.message}`)
          .status(StatusCode.OK)
          .json({
            status: true,
            message: "New Access Token Created",
            accessToken: result.message,
          });
      } else if (result?.message === "Token expired") {
        res
          .status(StatusCode.UNAUTHORIZED)
          .json({ status: false, message: "Refresh token expired" });
      } else {
        res
          .status(StatusCode.UNAUTHORIZED)
          .json({ status: false, message: "Failed to refresh token" });
      }
    } catch (error) {
      res
        .status(StatusCode.UNAUTHORIZED)
        .json({ status: false, message: "New Access Token not Generated" });
    }
  };
}
