import { Request, Response } from "express";

export default interface IuserController {
  getProfile(req: Request, res: Response): Promise<void>;
}
