import { NextFunction, Request, Response } from "express";

export default interface ImeetController {
  createMeet(req: Request, res: Response, next: NextFunction): Promise<void>;
  getMeets(req: Request, res: Response, next: NextFunction): Promise<void>;
  getMeetDataAdmin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getUserMeets(req: Request, res: Response, next: NextFunction): Promise<void>;
}
