import { Request, Response } from "express";

export interface IauthController {
  sendMail(req: Request, res: Response): Promise<void>;
  verifyOTP(req: Request, res: Response): Promise<void>;
  insertUser(req: Request, res: Response): Promise<void>;
  loginVerify(req: Request, res: Response): Promise<void>;
  refreshToken(req: Request, res: Response): Promise<void>;
  
}
