import { Request, Response } from "express";

export default interface IrequestController {
  getProfile(req: Request, res: Response): Promise<void>;
}
