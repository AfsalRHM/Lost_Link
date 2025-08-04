import { NextFunction, Request, Response } from "express";

export default interface IauthController {
  sendMail(req: Request, res: Response, next: NextFunction): Promise<void>;
  verifyOTP(req: Request, res: Response, next: NextFunction): Promise<void>;
  insertUser(req: Request, res: Response, next: NextFunction): Promise<void>;
  loginVerify(req: Request, res: Response, next: NextFunction): Promise<void>;
  refreshToken(req: Request, res: Response, next: NextFunction): Promise<void>;
  sendResetPasswordMail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  resetPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
  googleLoginVerify(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  userLogout(req: Request, res: Response, next: NextFunction): Promise<void>;
}
