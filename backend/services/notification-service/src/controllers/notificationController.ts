import { Request, Response } from "express";
import InotificationController from "../interface/InotificationController";
import notificationService from "../services/notificationService";
import { StatusCode } from "../constants/statusCodes";

export default class notificationController implements InotificationController {
  private _notificationService: notificationService;

  constructor() {
    this._notificationService = new notificationService();
  }

  // To get the user notifications
  public getNotifications = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.body.userId;
      if (!userId) {
        throw new Error("User Id not passed correctly");
      }

      const response = await this._notificationService.getNotifications({
        userId,
      });

      if (response.status) {
        res.status(StatusCode.OK).json(response);
      } else {
        res.status(StatusCode.BAD_REQUEST).json(response);
      }
    } catch (error) {
      console.log("error in getNotifications/notificationController", error);
      return;
    }
  };

  // To change the notification seen or status
  public changeUserNotificationSeen = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.body.userId;
      if (!userId) {
        throw new Error("User Id not passed correctly");
      }

      const response =
        await this._notificationService.changeUserNotificationSeen({ userId });

      if (response.status) {
        res.status(StatusCode.OK).json(response);
      } else {
        res.status(StatusCode.BAD_REQUEST).json(response);
      }
    } catch (error) {
      console.log(
        "error in changeUserNotificationSeen/notificationController",
        error
      );
      return;
    }
  };

  // To change the notification seen or status on admin
  public changeAdminNotificationSeen = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const response =
        await this._notificationService.changeAdminNotificationSeen();

      if (response.status) {
        res.status(StatusCode.OK).json(response);
      } else {
        res.status(StatusCode.BAD_REQUEST).json(response);
      }
    } catch (error) {
      console.log(
        "error in changeAdminNotificationSeen/notificationController",
        error
      );
      return;
    }
  };

  // To change the notification seen or status on admin
  public changeAdminOneNotificationSeen = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const notificationId = req.body.notificationId;

      const response =
        await this._notificationService.changeAdminOneNotificationSeen({
          notificationId,
        });

      if (response.status) {
        res.status(StatusCode.OK).json(response);
      } else {
        res.status(StatusCode.BAD_REQUEST).json(response);
      }
    } catch (error) {
      console.log(
        "error in changeAdminOneNotificationSeen/notificationController",
        error
      );
      return;
    }
  };

  // To get the admin notifications
  public getAdminNotifications = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const response = await this._notificationService.getAdminNotifications();

      if (response.status) {
        res.status(StatusCode.OK).json(response);
      } else {
        res.status(StatusCode.BAD_REQUEST).json(response);
      }
    } catch (error) {
      console.log("error in getNotifications/notificationController", error);
      return;
    }
  };
}
