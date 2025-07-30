import express from "express";
const notification_route = express.Router();

import notificationController from "../controllers/notificationController";
import verifyAccessToken, { verifyAdminAccessToken } from "../middlewares/jwtVerifyUser";

const NotificationController = new notificationController();

/*************************      User Side       *******************************/
// Get Requests
notification_route.get("/:id/my", verifyAccessToken, NotificationController.getNotifications);

// Patch Requests
notification_route.patch("/:id", verifyAccessToken, NotificationController.changeUserNotificationSeen);


/*************************      Admin Side       *******************************/
// Get Requests
notification_route.get("/admin", verifyAdminAccessToken, NotificationController.getAdminNotifications);

// Patch Requests
notification_route.patch("/admin/all", verifyAdminAccessToken, NotificationController.changeAdminNotificationSeen);
notification_route.patch("/admin/:id", verifyAdminAccessToken, NotificationController.changeAdminOneNotificationSeen);

export default notification_route;
