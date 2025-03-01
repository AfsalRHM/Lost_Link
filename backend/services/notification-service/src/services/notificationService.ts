import InotificationService from "../interface/InotificationService";
import notificationRepository from "../repositories/notificationRepository";

export default class notificationService implements InotificationService {
  private _notificationRepository: notificationRepository;

  constructor() {
    this._notificationRepository = new notificationRepository();
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
    } catch (error) {
      console.log(error, "error on the createNotification/notificaitonService");
      return {
        status: false,
        data: null,
        message: "Failed to get all the Chats",
      };
    }
  }

  // To get all the notificaitons of a user
  async getNotifications({ userId }: { userId: string }): Promise<any> {
    try {
      if (!userId) {
        return {
          status: false,
          data: null,
          message:
            "User id not get in the getNotifications/notificaitonService",
        };
      }
      const notificationData = await this._notificationRepository.findSome({
        sender: "admin",
        user_id: userId,
        seen: false,
      });

      if (notificationData) {
        return {
          status: true,
          data: notificationData,
          message: "Fetched all the Notifications",
        };
      } else {
        return {
          status: true,
          data: null,
          message: "Notification is Empty",
        };
      }
    } catch (error) {
      console.log(error, "error on the getNotifications/notificaitonService");
      return {
        status: false,
        data: null,
        message: "Failed to get the Notifications",
      };
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
        return {
          status: false,
          data: null,
          message:
            "User id not get in the changeUserNotificationSeen/notificaitonService",
        };
      }
      const notificationData = await this._notificationRepository.updateAll(
        userId
      );

      if (notificationData) {
        return {
          status: true,
          data: notificationData,
          message: "Marked all notifications as seen",
        };
      } else {
        return {
          status: true,
          data: null,
          message: "No notifications found to update",
        };
      }
    } catch (error) {
      console.log(error, "error on the getNotifications/notificaitonService");
      return {
        status: false,
        data: null,
        message: "Failed to get the Notifications",
      };
    }
  }

  // To Change the notification seen for Admin
  async changeAdminNotificationSeen(): Promise<any> {
    try {
      const notificationData = await this._notificationRepository.updateAll();

      if (notificationData) {
        return {
          status: true,
          data: notificationData,
          message: "Marked all notifications as seen",
        };
      } else {
        return {
          status: true,
          data: null,
          message: "No notifications found to update",
        };
      }
    } catch (error) {
      console.log(
        error,
        "error on the changeAdminNotificationSeen/notificaitonService"
      );
      return {
        status: false,
        data: null,
        message: "Failed to get the Notifications",
      };
    }
  }

  // To get all the notificaitons of a admin
  async getAdminNotifications(): Promise<any> {
    try {
      const notificationData = await this._notificationRepository.findSome({
        sender: "user",
        seen: false,
      });

      if (notificationData) {
        return {
          status: true,
          data: notificationData,
          message: "Fetched all the Notifications",
        };
      } else {
        return {
          status: true,
          data: null,
          message: "Notification is Empty",
        };
      }
    } catch (error) {
      console.log(
        error,
        "error on the getAdminNotifications/notificaitonService"
      );
      return {
        status: false,
        data: null,
        message: "Failed to get the Notifications",
      };
    }
  }
}
