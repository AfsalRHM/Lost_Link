import { Request, Response } from "express";

export default interface ImessageController {
  sendMessage(req: Request, res: Response): Promise<void>;
  sendAdminMessage(req: Request, res: Response): Promise<void>;
  getMessages(req: Request, res: Response): Promise<void>;
}
