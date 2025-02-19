import express from "express";
const message_route = express.Router();

import messageController from "../controllers/messageController";
import verifyAccessToken, { verifyAdminAccessToken } from "../middlewares/jwtVerifyUser";

const MessageController = new messageController();

/*************************      User Side       *******************************/
// Get Requests
message_route.get("/get-messages/:chatId", verifyAccessToken, MessageController.getMessages); // To get all the messages of a praticular chat

// Post Requests
message_route.post("/send-message", verifyAccessToken, MessageController.sendMessage); // To send/create a new message

// Patch Requests


/*************************      Admin Side       *******************************/
// Get Requests
message_route.get("/get-user-messages/:chatId", verifyAdminAccessToken, MessageController.getMessages); // To get all the messages of a praticular chat

// Post Requests
message_route.post("/send-admin-message", verifyAdminAccessToken, MessageController.sendAdminMessage); // To send/create a new message

export default message_route;
