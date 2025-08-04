import { NextFunction, Request, Response } from "express";

export default interface IchatController {
  getUserChat(req: Request, res: Response, next: NextFunction): Promise<void>;
  getAllChats(req: Request, res: Response, next: NextFunction): Promise<void>;
  getChatDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getAllUserChats(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
