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
        const response = await this._authService.sendMail(
          req.body.recieverEmail,
          req.body.recieverName
        );

        res.status(200).json({ status: true, message: "User is New" });
      }
    } catch (error) {
      console.log("error in authController", error);
    }
  };

  public sendResetPasswordMail = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
      } else {
        const response = await this._authService.sendMail(
          req.body.recieverEmail,
          req.body.recieverName
        );
        if (response.message == "No user found") {
          res.status(200).json({ status: false, message: "User not Found" });
        } else {
          res.status(200).json({ status: true, message: "User is New" });
        }
      }
    } catch (error) {
      console.log("error in authController", error);
    }
  };

  public resetPassword = async (req: Request, res: Response): Promise<any> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
      } else {
        const response = await this._authService.resetPassword(
          req.body.userEmail,
          req.body.newPassword
        );
        if (response.message == "Password changed") {
          res
            .status(200)
            .json({ status: true, message: "Password Changed Successfully" });
        } else {
          res
            .status(200)
            .json({ status: false, message: "Password didn't changed" });
        }
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
          id: result.data._id.toString(),
          email: result.data.email,
          role: result.data.role,
        });
        const refreshToken = jwtFunctions.generateRefreshToken({
          id: result.data._id.toString(),
          email: result.data.email,
          role: result.data.role,
        });

        res
          .status(200)
          .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
            path: "/",
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

  // To Verify the Refresh Token and Create new Access Token
  public refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const refreshToken = req.cookies.refreshToken;
      const result = await this._authService.refreshToken(refreshToken);
      if (result?.status == true) {
        res
          .setHeader("Authorization", `Bearer ${result.data}`)
          .status(200)
          .json(result);
      } else {
        res.status(401).json(result);
      }
    } catch (error) {
      res
        .status(401)
        .json({ status: false, message: "New Access Token not Generated" });
    }
  };

  public adminRefreshToken = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const refreshToken = req.cookies.refreshToken;
      console.log(refreshToken, "console from the refreshToken/authController");
      const result = await this._authService.adminRefreshToken(refreshToken);
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

  public googleLoginVerify = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      if (req.body.email) {
        const response = await this._authService.googleLoginVerify(
          req.body.email
        );
        if (response.data?.status == "inactive") {
          res.status(401).json({
            status: false,
            message: "Your Account has been Blocked",
          });
        } else {
          if (response.data?.status == "active") {
            if (response.status && response.data) {
              const accessToken = jwtFunctions.generateAccessToken({
                id: response.data._id.toString(),
                email: response.data.email,
                role: response.data.role,
              });
              const refreshToken = jwtFunctions.generateRefreshToken({
                id: response.data._id.toString(),
                email: response.data.email,
                role: response.data.role,
              });

              res
                .status(200)
                .cookie("refreshToken", refreshToken, {
                  httpOnly: true,
                  sameSite: "strict",
                  path: "/",
                })
                .setHeader("Authorization", `Bearer ${accessToken}`)
                .json({
                  status: true,
                  data: response.data,
                  message: "Login Successfull...!",
                });
            }
          } else {
            res.status(401).json({
              status: false,
              message: "Error on GoogleLoginVerify/authController 2",
            });
          }
        }
      }
    } catch (error) {
      res.status(401).json({
        status: false,
        message: "Error on GoogleLoginVerify/authController 1",
      });
    }
  };

  public userLogout = async (req: Request, res: Response): Promise<void> => {
    try {
      res
        .status(200)
        .clearCookie("refreshToken", {
          httpOnly: true,
          sameSite: "strict",
          path: "/",
        })
        .json({ status: "true", message: "Logged out successfully" });
    } catch (error) {
      res.status(401).json({
        status: false,
        message: "Error on userLogout/authController",
      });
    }
  };
}
