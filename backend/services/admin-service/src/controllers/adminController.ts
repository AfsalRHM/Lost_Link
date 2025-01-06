import { Request, Response } from "express";
import IadminController from "../interface/IadminController";
import adminService from "../services/adminService";

import jwtFunctions from "../utils/jwt";

export default class authController implements IadminController {
  private _adminService: adminService;

  constructor() {
    this._adminService = new adminService();
  }

  public adminLogin = async (req: Request, res: Response): Promise<void> => {
    const response = await this._adminService.adminLogin(req.body);
    if (response.status) {
      const accessToken = jwtFunctions.generateAccessToken({
        userId: response.data._id.toString(),
      });
      const refreshToken = jwtFunctions.generateRefreshToken({
        userId: response.data._id.toString(),
      });

      res
        .status(200)
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          sameSite: "strict",
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
      console.log(response, "from the getAllAdmins/adminController");
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
        .json({ message: "error on the getAllUsers/changeUserStatus" });
    }
  };

  public insertAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
      const response = await this._adminService.insertAdmin(req.body.Props);
      res.status(200).json(response);
    } catch (error) {
      res
        .status(300)
        .json({ message: "error on the getAllUsers/changeUserStatus" });
    }
  };
}
