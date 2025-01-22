import { Request, Response } from "express";
import IadminController from "../interface/IadminController";
import adminService from "../services/adminService";

export default class authController implements IadminController {
  private _adminService: adminService;

  constructor() {
    this._adminService = new adminService();
  }

  public adminLogin = async (req: Request, res: Response): Promise<void> => {
    const response = await this._adminService.adminLogin(req.body);
    if (response.status) {
      const accessToken = response.tokenData.accessToken;
      const refreshToken = response.tokenData.refreshToken;

      res
        .status(200)
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
        });
    } else {
      res
        .status(200)
        .json({ status: false, message: "Login Failed", data: null });
    }
  };

  public getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('Here reaching on the getAllUsers/adminController')
      const response = await this._adminService.getAllUsers();
      res.status(200).json(response);
    } catch (error) {
      res
        .status(300)
        .json({ message: "error on the getAllUsers/adminController" });
    }
  };

  public getAllAdmins = async (req: Request, res: Response): Promise<void> => {
    try {
      const response = await this._adminService.getAllAdmins();
      res.status(200).json(response);
    } catch (error) {
      res
        .status(300)
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
      res.status(200).json(response);
    } catch (error) {
      res
        .status(300)
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
      res.status(200).json(response);
    } catch (error) {
      res
        .status(300)
        .json({ message: "error on the changeAdminStatus/adminController" });
    }
  };

  public insertAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
      const response = await this._adminService.insertAdmin(req.body.Props);
      res.status(200).json(response);
    } catch (error) {
      res
        .status(300)
        .json({ message: "error on the insertAdmin/adminController" });
    }
  };

  public adminLogout = async (req: Request, res: Response): Promise<void> => {
    try {
      res
        .status(200)
        .clearCookie("adminRefreshToken", {
          httpOnly: true,
          sameSite: "strict",
          path: "/",
        })
        .json({ status: "true", message: "Logged out successfully" });
    } catch (error) {
      res
        .status(300)
        .json({ message: "error on the adminLogout/adminController" });
    }
  };

  public refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const refreshToken = req.cookies.adminRefreshToken;
      const result = await this._adminService.refreshToken(refreshToken);
      if (result?.status == true) {
        res
          .setHeader("Authorization", `Bearer ${result.message}`)
          .status(200)
          .json({ status: true, message: "New Access Token Created" });
      } else if (result?.message === "Token expired") {
        res
          .status(401)
          .json({ status: false, message: "Refresh token expired" });
      } else {
        res
          .status(401)
          .json({ status: false, message: "Failed to refresh token" });
      }
    } catch (error) {
      res
        .status(401)
        .json({ status: false, message: "New Access Token not Generated" });
    }
  };
}
