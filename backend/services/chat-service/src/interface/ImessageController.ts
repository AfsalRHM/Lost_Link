import { NextFunction, Request, Response } from "express";

export default interface ImessageController {
  sendMessage(req: Request, res: Response, next: NextFunction): Promise<void>;
  sendAdminMessage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getMessages(req: Request, res: Response, next: NextFunction): Promise<void>;
}
