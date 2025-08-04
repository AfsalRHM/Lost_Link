import { NextFunction, Request, Response } from "express";

export default interface InotificationController {
  getNotifications(req: Request, res: Response, next: NextFunction): Promise<void>;
  changeUserNotificationSeen(req: Request, res: Response, next: NextFunction): Promise<void>;
  changeAdminNotificationSeen(req: Request, res: Response, next: NextFunction): Promise<void>;
  changeAdminOneNotificationSeen(req: Request, res: Response, next: NextFunction): Promise<void>;
  getAdminNotifications(req: Request, res: Response, next: NextFunction): Promise<void>;
}
