import { Request, Response } from "express";
import { IauthController } from "../interface/IauthController";
import authService from "../services/authService";
import { validationResult } from "express-validator";

import jwtFunctions from "../utils/jwt";
import { StatusCode } from "../constants/statusCodes";

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
        return res
          .status(StatusCode.BAD_REQUEST)
          .json({ errors: errors.array() });
      }

      const userExists = await this._authService.checkMail(
        req.body.recieverEmail
      );
      if (userExists == true) {
        res.status(StatusCode.BAD_REQUEST).json({
          status: false,
          message: "User already exists with this Email",
        });
      } else {
        const response = await this._authService.sendMail(
          req.body.recieverEmail,
          req.body.recieverName
        );

        res
          .status(StatusCode.OK)
          .json({ status: true, message: "User is New" });
      }
    } catch (error) {
      console.log("error in authController/sendMail", error);
    }
  };

  public sendResetPasswordMail = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(StatusCode.BAD_REQUEST).json({ errors: errors.array() });
      } else {
        const response = await this._authService.sendMail(
          req.body.recieverEmail,
          req.body.recieverName
        );
        if (response.message == "No user found") {
          res
            .status(StatusCode.BAD_REQUEST)
            .json({ status: false, message: "User not Found" });
        } else {
          res
            .status(StatusCode.OK)
            .json({ status: true, message: "User is New" });
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
        res.status(StatusCode.BAD_REQUEST).json({ errors: errors.array() });
      } else {
        const response = await this._authService.resetPassword(
          req.body.userEmail,
          req.body.newPassword
        );
        if (response.message == "Password changed") {
          res
            .status(StatusCode.OK)
            .json({ status: true, message: "Password Changed Successfully" });
        } else {
          res
            .status(StatusCode.OK)
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
        return res
          .status(StatusCode.BAD_REQUEST)
          .json({ errors: errors.array() });
      }

      const result: boolean = await this._authService.verifyotp(
        req.body.userEmail,
        req.body.userEnteredOTP
      );
      res
        .status(StatusCode.OK)
        .json({ status: result, message: "OTP Verified" });
    } catch (error) {
      console.log("error in authController/verfiyOTP", error);
      res
        .status(StatusCode.OK)
        .json({ status: false, message: "Internal Server Error" });
    }
  };

  // Controller to Insert the User after Registeration.
  public insertUser = async (req: Request, res: Response): Promise<any> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(StatusCode.BAD_REQUEST)
          .json({ errors: errors.array() });
      }

      const userExists = await this._authService.checkMail(req.body.userEmail);
      if (userExists) {
        res
          .status(StatusCode.BAD_REQUEST)
          .json({ status: false, message: "User with Email already Exixts." });
      } else {
        const userData = await this._authService.insertuser(
          req.body.userFullName,
          req.body.userName,
          req.body.userLocation,
          req.body.userEmail,
          req.body.userPassword
        );
        res.status(StatusCode.OK).json({
          status: true,
          message: "Registered Successfully",
          data: userData,
        });
      }
    } catch (error) {
      console.log("error in authController/insertUser", error);
      res
        .status(StatusCode.OK)
        .json({ status: false, message: "Internal Server Error" });
    }
  };

  // Controller to Verify the User while Login & Setting the JWT Tokens to the Cookies.
  public loginVerify = async (req: Request, res: Response): Promise<any> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(StatusCode.BAD_REQUEST)
          .json({ errors: errors.array() });
      }

      const response: { status: boolean; data: any; message?: string } =
        await this._authService.loginVerify(
          req.body.userEmail,
          req.body.userPassword
        );

      if (response.status == true) {
        const accessToken = jwtFunctions.generateAccessToken({
          id: response.data.data._id.toString(),
          email: response.data.data.email,
          role: response.data.data.role,
        });

        const refreshToken = jwtFunctions.generateRefreshToken({
          id: response.data.data._id.toString(),
          email: response.data.data.email,
          role: response.data.data.role,
        });

        res
          .status(StatusCode.OK)
          .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
            path: "/",
          })
          // .setHeader("Authorization", `Bearer ${accessToken}`)
          .header("Authorization", `Bearer ${accessToken}`)
          // Changed access token to send through body
          .json({
            status: true,
            message: "Login Successfull",
            data: response.data.data,
            accessToken,
          });
      } else {
        res.status(StatusCode.BAD_REQUEST).json(response);
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
          .status(StatusCode.OK)
          // Changed access token to send through body
          .json({ result, accessToken: result.data });
      } else {
        res.status(StatusCode.UNAUTHORIZED).json(result);
      }
    } catch (error) {
      res
        .status(StatusCode.UNAUTHORIZED)
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
          .status(StatusCode.OK)
          .json({ status: true, message: "New Access Token Created" });
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

  public googleLoginVerify = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      console.log(req.body, "this is the body");
      const userMail = req.body.userMail;
      if (userMail) {
        const response = await this._authService.googleLoginVerify(userMail);

        if (response.status && response.data.data) {
          const accessToken = jwtFunctions.generateAccessToken({
            id: response.data.data._id.toString(),
            email: response.data.data.email,
            role: response.data.data.role,
          });
          const refreshToken = jwtFunctions.generateRefreshToken({
            id: response.data.data._id.toString(),
            email: response.data.data.email,
            role: response.data.data.role,
          });

          res
            .status(StatusCode.OK)
            .cookie("refreshToken", refreshToken, {
              httpOnly: true,
              sameSite: "strict",
              path: "/",
            })
            .setHeader("Authorization", `Bearer ${accessToken}`)
            .json({
              status: true,
              data: response.data.data,
              message: "Login Successfull...!",
              accessToken,
            });
        } else {
          res.status(StatusCode.BAD_REQUEST).json(response);
        }
      } else {
        throw new Error("Mail Cannot be fectched");
      }
    } catch (error) {
      console.log(error, "From the GoogleLoginVerify/authController");
      res.status(StatusCode.UNAUTHORIZED).json({
        status: false,
        message: "Error on GoogleLoginVerify/authController 1",
      });
    }
  };

  public userLogout = async (req: Request, res: Response): Promise<void> => {
    try {
      res
        .status(StatusCode.OK)
        .clearCookie("refreshToken", {
          httpOnly: true,
          sameSite: "strict",
          path: "/",
        })
        .json({ status: "true", message: "Logged out successfully" });
    } catch (error) {
      res.status(StatusCode.UNAUTHORIZED).json({
        status: false,
        message: "Error on userLogout/authController",
      });
    }
  };
}
