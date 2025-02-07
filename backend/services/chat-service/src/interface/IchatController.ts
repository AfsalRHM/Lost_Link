import { Request, Response } from "express";

export default interface IchatController {
  getUserChat(req: Request, res: Response): Promise<void>;
}
