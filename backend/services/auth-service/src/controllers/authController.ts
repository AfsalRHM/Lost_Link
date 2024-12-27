import { Request, Response } from "express";
import { IauthController } from "../interface/IauthController";
import authService from "../services/authService";
import { validationResult } from "express-validator";

import jwtFunctions from "../utils/jwt";

export default class authController implements IauthController {
  private _authService: authService;

  constructor() {
    this._authService = new authService();
  }

  // Controller to Send the Mail to User

  public sendMail = async (req: Request, res: Response): Promise<any> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userExists = await this._authService.checkMail(
        req.body.recieverEmail
      );
      if (userExists == true) {
        res.status(200).json({
          status: false,
          message: "User already exits with this Email",
        });
      } else {
        await this._authService.sendMail(
          req.body.recieverEmail,
          req.body.recieverName
        );
        res.status(200).json({ status: true, message: "User is New" });
      }
    } catch (error) {
      console.log("error in authController", error);
    }
  };

  // Controller to Verify the User Entered OTP

  public verifyOTP = async (req: Request, res: Response): Promise<any> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const result: boolean = await this._authService.verifyotp(
        req.body.userEmail,
        req.body.userEnteredOTP
      );
      res.status(200).json({ status: result });
    } catch (error) {
      console.log("error in authController/verfiyOTP", error);
      res.status(200).json({ status: false, message: "Internal Server Error" });
    }
  };

  // Controller to Insert the User after Registeration.

  public insertUser = async (req: Request, res: Response): Promise<any> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userExists = await this._authService.checkMail(req.body.userEmail);
      if (userExists) {
        res
          .status(200)
          .json({ status: false, message: "User with Email already Exixts." });
      } else {
        const userData = await this._authService.insertuser(
          req.body.userFullName,
          req.body.userName,
          req.body.userLocation,
          req.body.userEmail,
          req.body.userPassword
        );
        res.status(200).json({
          status: true,
          message: "Registered Successfully",
          data: userData,
        });
      }
    } catch (error) {
      console.log("error in authController/insertUser", error);
      res.status(200).json({ status: false, message: "Internal Server Error" });
    }
  };

  // Controller to Verify the User while Login & Setting the JWT Tokens to the Cookies.

  public loginVerify = async (req: Request, res: Response): Promise<any> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const result: { status: boolean; data: any; message?: string } =
        await this._authService.loginVerify(
          req.body.userEmail,
          req.body.userPassword
        );

      if (result.status == true) {
        const accessToken = jwtFunctions.generateAccessToken({
          userId: result.data._id.toString(),
        });
        const refreshToken = jwtFunctions.generateRefreshToken({
          userId: result.data._id.toString(),
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
            data: result.data,
          });
      } else {
        res.status(200).json({ status: false, message: result.message });
      }
    } catch (error) {
      console.log("Error on authController/loginVerify", error);
    }
  };

  public refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const refreshToken = req.cookies.refreshToken;
      const result = await this._authService.refreshToken(refreshToken);
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
