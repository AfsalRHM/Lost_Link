import { NextFunction, Request, Response } from "express";

import InotificationController from "../interface/InotificationController";
import InotificationService from "../interface/InotificationService";

import { StatusCode } from "../constants/statusCodes";
import { AppError } from "../utils/appError";

export default class NotificationController implements InotificationController {
  private _notificationService: InotificationService;

  constructor(notificationService: InotificationService) {
    this._notificationService = notificationService;
  }

  // To get the user notifications
  public getNotifications = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.params.id;
      if (!userId) {
        throw new AppError("userId is required", StatusCode.BAD_REQUEST);
      }

      const notifications = await this._notificationService.getNotifications({
        userId,
      });

      res.status(StatusCode.OK).json({
        status: true,
        data: notifications,
        message: "User notification fetched",
      });
    } catch (error) {
      console.log("error in getNotifications/notificationController", error);
      next(error);
    }
  };

  // To change the notification seen or status
  public changeUserNotificationSeen = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.params.id;
      if (!userId) {
        throw new AppError("userId is required", StatusCode.BAD_REQUEST);
      }

      await this._notificationService.changeUserNotificationSeen({ userId });

      res.status(StatusCode.OK).json({
        status: true,
        data: null,
        message: "User notifications updated",
      });
    } catch (error) {
      console.log(
        "error in changeUserNotificationSeen/notificationController",
        error
      );
      next(error);
    }
  };

  // To change the notification seen or status on admin
  public changeAdminNotificationSeen = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await this._notificationService.changeAdminNotificationSeen();

      res.status(StatusCode.OK).json({
        status: true,
        data: null,
        message: "Admin notifications updated",
      });
    } catch (error) {
      console.log(
        "error in changeAdminNotificationSeen/notificationController",
        error
      );
      next(error);
    }
  };

  // To change the notification seen or status on admin
  public changeAdminOneNotificationSeen = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const notificationId = req.params.id;
      if (!notificationId) {
        throw new AppError(
          "notificationId is required",
          StatusCode.BAD_REQUEST
        );
      }

      await this._notificationService.changeAdminOneNotificationSeen({
        notificationId,
      });

      res.status(StatusCode.OK).json({
        status: true,
        data: null,
        message: "Admin's one notification updated",
      });
    } catch (error) {
      console.log(
        "error in changeAdminOneNotificationSeen/notificationController",
        error
      );
      next(error);
    }
  };

  // To get the admin notifications
  public getAdminNotifications = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const notifications =
        await this._notificationService.getAdminNotifications();

      res.status(StatusCode.OK).json({
        status: true,
        data: notifications,
        message: "Admin notificaitons fetched",
      });
    } catch (error) {
      console.log(
        "error in getAdminNotifications/notificationController",
        error
      );
      next(error);
    }
  };
}
