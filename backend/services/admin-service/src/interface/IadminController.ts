import { Request, Response } from "express";

export default interface IadminController {
  adminLogin(req: Request, res: Response): Promise<void>;
  getAllUsers(req: Request, res: Response): Promise<void>;
  getAllAdmins(req: Request, res: Response): Promise<void>;
  changeUserStatus(req: Request, res: Response): Promise<void>;
  insertAdmin(req: Request, res: Response): Promise<void>;
  adminLogout(req: Request, res: Response): Promise<void>;
}
