import express from "express";
const notification_route = express.Router();

import notificationController from "../controllers/notificationController";
import verifyAccessToken, { verifyAdminAccessToken } from "../middlewares/jwtVerifyUser";

const NotificationController = new notificationController();

/*************************      User Side       *******************************/
// Get Requests

// Post Requests

// Patch Requests


/*************************      Admin Side       *******************************/
// Get Requests

// Post Requests

export default notification_route;
