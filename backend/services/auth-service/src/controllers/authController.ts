import { NextFunction, Request, Response } from "express";

import IauthController from "../interface/IauthController";
import IauthService from "../interface/IauthService";

import jwtFunctions from "../utils/jwt";
import { validationResult } from "express-validator";
import { StatusCode } from "../constants/statusCodes";
import { AppError } from "../utils/appError";

export default class AuthController implements IauthController {
  private _authService: IauthService;

  constructor(authService: IauthService) {
    this._authService = authService;
  }

  // To Send the Mail to User
  public sendMail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(StatusCode.BAD_REQUEST).json({
          status: false,
          errors: errors.array(),
          message: "validation failed",
        });
        return;
      }

      const { recieverEmail, recieverName } = req.body;

      const userExists = await this._authService.checkMail(recieverEmail);
      if (userExists) {
        throw new AppError("User already exists", StatusCode.CONFLICT);
      }

      await this._authService.sendMail(recieverEmail, recieverName);

      res
        .status(StatusCode.OK)
        .json({ status: true, data: null, message: "User is New" });
    } catch (error) {
      next(error);
    }
  };

  // To Send the Mail to User
  public sendResetPasswordMail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(StatusCode.BAD_REQUEST).json({
          status: false,
          errors: errors.array(),
          message: "validation failed",
        });
        return;
      }

      const { recieverEmail, recieverName } = req.body;

      await this._authService.sendMail(recieverEmail, recieverName);

      res
        .status(StatusCode.OK)
        .json({ status: true, data: null, message: "Mail send" });
    } catch (error) {
      next(error);
    }
  };

  // To reset password
  public resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(StatusCode.BAD_REQUEST).json({
          status: false,
          errors: errors.array(),
          message: "validation failed",
        });
        return;
      }

      const { userEmail, newPassword } = req.body;

      await this._authService.resetPassword(userEmail, newPassword);

      res.status(StatusCode.OK).json({
        status: true,
        message: "Password Changed Successfully",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  };

  // To Verify the User Entered OTP
  public verifyOTP = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(StatusCode.BAD_REQUEST).json({
          status: false,
          errors: errors.array(),
          message: "validation failed",
        });
        return;
      }

      const { userEmail, userEnteredOTP } = req.body;

      await this._authService.verifyotp(userEmail, userEnteredOTP);

      res
        .status(StatusCode.OK)
        .json({ status: true, data: null, message: "OTP Verified" });
    } catch (error) {
      next(error);
    }
  };

  // To Insert the User after Registeration.
  public insertUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(StatusCode.BAD_REQUEST).json({
          status: false,
          errors: errors.array(),
          message: "validation failed",
        });
        return;
      }

      const userExists = await this._authService.checkMail(req.body.userEmail);
      if (!userExists) {
        throw new AppError(
          "User with mail already exists",
          StatusCode.CONFLICT
        );
      }

      const user = await this._authService.insertuser(
        req.body.userFullName,
        req.body.userName,
        req.body.userLocation,
        req.body.userEmail,
        req.body.userPassword
      );

      res.status(StatusCode.OK).json({
        status: true,
        message: "Registered Successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  // To Verify the User while Login & Setting the JWT Tokens to the Cookies.
  public loginVerify = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(StatusCode.BAD_REQUEST).json({
          status: false,
          errors: errors.array(),
          message: "validation failed",
        });
        return;
      }

      const { userEmail, userPassword } = req.body;

      const user = await this._authService.loginVerify(userEmail, userPassword);

      const accessToken = jwtFunctions.generateAccessToken({
        id: user._id.toString(),
        email: user.email,
        role: "user",
        name: user.user_name,
      });
      const refreshToken = jwtFunctions.generateRefreshToken({
        id: user._id.toString(),
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
          data: user,
          accessToken,
        });
    } catch (error) {
      next(error);
    }
  };

  // To Verify the Refresh Token and Create new Access Token
  public refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        throw new AppError(
          "Unauthorized: Refresh token missing",
          StatusCode.UNAUTHORIZED
        );
      }

      const newAccessToken = await this._authService.refreshToken(refreshToken);

      res
        .setHeader("Authorization", `Bearer ${newAccessToken}`)
        .status(StatusCode.OK)
        // Changed access token to send through body
        .json({
          status: true,
          accessToken: newAccessToken,
          message: "New token created",
        });
    } catch (error) {
      next(error);
    }
  };

  // To Verify the Admin Refresh Token and Create new Access Token
  public adminRefreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        throw new AppError(
          "Unauthorized: Refresh token missing",
          StatusCode.UNAUTHORIZED
        );
      }

      const newAccessToken = await this._authService.adminRefreshToken(
        refreshToken
      );

      res
        .setHeader("Authorization", `Bearer ${newAccessToken}`)
        .status(StatusCode.OK)
        .json({ status: true, message: "New Access Token Created" });
    } catch (error) {
      next(error);
    }
  };

  // To Verify google login
  public googleLoginVerify = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userMail = req.body.userMail;
      if (!userMail) {
        throw new AppError("userMail is required", StatusCode.BAD_REQUEST);
      }

      const user = await this._authService.googleLoginVerify(userMail);

      const accessToken = jwtFunctions.generateAccessToken({
        id: user.data._id.toString(),
        email: user.data.email,
        role: "user",
        name: user.data.user_name,
      });
      const refreshToken = jwtFunctions.generateRefreshToken({
        id: user.data._id.toString(),
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
          data: user.data,
          message: "Login Successfull...!",
          accessToken,
        });
    } catch (error) {
      next(error);
    }
  };

  // To Logout user
  public userLogout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      res
        .status(StatusCode.OK)
        .clearCookie("refreshToken", {
          httpOnly: true,
          sameSite: "strict",
          path: "/",
        })
        .json({
          status: "true",
          message: "Logged out successfully",
          data: null,
        });
    } catch (error) {
      next(error);
    }
  };
}
