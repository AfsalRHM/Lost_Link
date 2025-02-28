import { Request, Response } from "express";

export default interface InotificationController {
  getNotifications(req: Request, res: Response): Promise<void>;
}
