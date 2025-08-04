import { NextFunction, Request, Response } from "express";

export default interface IadminController {
  adminLogin(req: Request, res: Response, next: NextFunction): Promise<void>;
  getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
  getAllAdmins(req: Request, res: Response, next: NextFunction): Promise<void>;
  changeUserStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  insertAdmin(req: Request, res: Response, next: NextFunction): Promise<void>;
  adminLogout(req: Request, res: Response, next: NextFunction): Promise<void>;
}
