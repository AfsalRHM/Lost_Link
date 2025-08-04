import { NextFunction, Request, Response } from "express";

export default interface IcommentController {
  createComment(req: Request, res: Response, next: NextFunction): Promise<void>;
  getRequestComments(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
