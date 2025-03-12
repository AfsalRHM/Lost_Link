import { Request, Response } from "express";

export default interface ImeetController {
  createMeet(req: Request, res: Response): Promise<void>;
  getAllMeets(req: Request, res: Response): Promise<void>;
  getMeetDataAdmin(req: Request, res: Response): Promise<void>;
}
