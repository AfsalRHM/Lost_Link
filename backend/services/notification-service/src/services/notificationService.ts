import notificationRepository from "../repositories/notificationRepository";
import notificationModel from "../model/notificationModel";

import InotificationService from "../interface/InotificationService";

import { AppError } from "../utils/appError";
import { StatusCode } from "../constants/statusCodes";
import { handleServiceError } from "../utils/errorHandler";

export default class NotificationService implements InotificationService {
  private _notificationRepository: notificationRepository;

  constructor() {
    this._notificationRepository = new notificationRepository(
      notificationModel
    );
  }

  // To create a notification
  async createNotification(notfication: any): Promise<any> {
    try {
      const notificationData = await this._notificationRepository.insert({
        sender: notfication.sender,
        request_id: notfication.request,
        chat_id: notfication.chat,
        user_id: notfication.user,
      });

      if (notificationData) {
        return {
          status: true,
          data: notificationData,
          message: "Created Notification",
        };
      } else {
        return {
          status: false,
          data: null,
          message: "Unable to Insert Data",
        };
      }
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(
        error,
        "Something went wrong while creating notification"
      );
    }
  }

  // To get all the notificaitons of a user
  async getNotifications({ userId }: { userId: string }): Promise<any> {
    try {
      if (!userId) {
        throw new AppError("userId is required", StatusCode.BAD_REQUEST);
      }

      const notificationData = await this._notificationRepository.findSome({
        sender: "admin",
        user_id: userId,
        seen: false,
      });

      return notificationData;
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(
        error,
        "Something went wrong while user notifications"
      );
    }
  }

  // To Change the notification seen for user
  async changeUserNotificationSeen({
    userId,
  }: {
    userId: string;
  }): Promise<any> {
    try {
      if (!userId) {
        throw new AppError("userId is required", StatusCode.BAD_REQUEST);
      }

      const notificationData = await this._notificationRepository.updateAll(
        userId
      );
      if (!notificationData) {
        throw new AppError(
          "Failed to update the notifications status",
          StatusCode.INTERNAL_SERVER_ERROR
        );
      }

      return;
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(
        error,
        "Something went wrong while updating notifications status"
      );
    }
  }

  // To Change the notification seen for Admin
  async changeAdminNotificationSeen(): Promise<any> {
    try {
      const notificationData = await this._notificationRepository.updateAll();
      if (!notificationData) {
        throw new AppError("Failed to updated admin notifications status");
      }

      return;
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(
        error,
        "Something went wrong while updating admin notifications status"
      );
    }
  }

  // To Change the notification seen for Admin
  async changeAdminOneNotificationSeen({
    notificationId,
  }: {
    notificationId: string;
  }): Promise<any> {
    try {
      if (!notificationId) {
        throw new AppError(
          "notificationId is required",
          StatusCode.BAD_REQUEST
        );
      }

      const notificationData =
        await this._notificationRepository.findByIdAndUpdate(notificationId, {
          seen: true,
        });
      if (!notificationData) {
        throw new AppError("Failed to update admin notification status");
      }

      return;
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(
        error,
        "Something went wrong while updating admin notification status"
      );
    }
  }

  // To get all the notificaitons of a admin
  async getAdminNotifications(): Promise<any> {
    try {
      const notificationData = await this._notificationRepository.findSome({
        sender: "user",
        seen: false,
      });

      return notificationData;
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(
        error,
        "Something went wrong while fetching admin notificaitons"
      );
    }
  }
}
