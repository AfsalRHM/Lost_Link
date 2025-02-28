import express from "express";
const notification_route = express.Router();

import notificationController from "../controllers/notificationController";
import verifyAccessToken, { verifyAdminAccessToken } from "../middlewares/jwtVerifyUser";

const NotificationController = new notificationController();

/*************************      User Side       *******************************/
// Get Requests

// Post Requests
notification_route.post("/get-notifications", verifyAccessToken, NotificationController.getNotifications);

// Patch Requests
notification_route.patch("/change-user-notification-seen", verifyAccessToken, NotificationController.changeUserNotificationSeen);


/*************************      Admin Side       *******************************/
// Get Requests
notification_route.get("/get-admin-notifications", verifyAdminAccessToken, NotificationController.getAdminNotifications);

// Patch Requests
notification_route.patch("/change-admin-notification-seen", verifyAdminAccessToken, NotificationController.changeAdminNotificationSeen);

export default notification_route;
