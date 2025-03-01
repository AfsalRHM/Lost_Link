import { Request, Response } from "express";

export default interface IcommentController {
  createComment(req: Request, res: Response): Promise<void>;
  getRequestComments(req: Request, res: Response): Promise<void>;
}
