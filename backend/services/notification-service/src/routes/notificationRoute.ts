import express from "express";
const notification_route = express.Router();

import NotificationService from "../services/notificationService";
import NotificationController from "../controllers/notificationController";
import NotificationRepository from "../repositories/notificationRepository";
import notificationModel from "../model/notificationModel";

const notificationRepository = new NotificationRepository(notificationModel)
const nofiticationService = new NotificationService(notificationRepository);
const notificationController = new NotificationController(nofiticationService);

/*************************      User Side       *******************************/
// Get Requests
notification_route.get("/:id/my", notificationController.getNotifications);

// Patch Requests
notification_route.patch("/:id", notificationController.changeUserNotificationSeen);


/*************************      Admin Side       *******************************/
// Get Requests
notification_route.get("/admin", notificationController.getAdminNotifications);

// Patch Requests
notification_route.patch("/admin/all", notificationController.changeAdminNotificationSeen);
notification_route.patch("/admin/:id", notificationController.changeAdminOneNotificationSeen);

export default notification_route;
