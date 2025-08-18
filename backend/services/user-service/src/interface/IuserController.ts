import { NextFunction, Request, Response } from "express";

export default interface IuserController {
  getProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
  getUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateUser(req: Request, res: Response, next: NextFunction): Promise<void>;
  getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
  getUserData(req: Request, res: Response, next: NextFunction): Promise<void>;
}
