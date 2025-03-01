import { Request, Response } from "express";

export default interface InotificationController {
  getNotifications(req: Request, res: Response): Promise<void>;
  changeUserNotificationSeen(req: Request, res: Response): Promise<void>;
  changeAdminNotificationSeen(req: Request, res: Response): Promise<void>;
  changeAdminOneNotificationSeen(req: Request, res: Response): Promise<void>;
  getAdminNotifications(req: Request, res: Response): Promise<void>;
}
