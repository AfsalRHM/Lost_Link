import { Request, Response } from "express";

export interface IauthController {
  sendMail(req: Request, res: Response): Promise<void>;
  verifyOTP(req: Request, res: Response): Promise<void>;
  insertUser(req: Request, res: Response): Promise<void>;
  loginVerify(req: Request, res: Response): Promise<void>;
  refreshToken(req: Request, res: Response): Promise<void>;
  sendResetPasswordMail(req: Request, res: Response): Promise<void>;
  resetPassword(req: Request, res: Response): Promise<void>;
  googleLoginVerify(req: Request, res: Response): Promise<void>;
  userLogout(req: Request, res: Response): Promise<void>;
}
