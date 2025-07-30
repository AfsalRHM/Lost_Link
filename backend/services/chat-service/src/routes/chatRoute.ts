import express from "express";
const chat_route = express.Router();

import chatController from "../controllers/chatController";
import verifyAccessToken, { verifyAdminAccessToken } from "../middlewares/jwtVerifyUser";

const ChatController = new chatController();

/*************************      User Side       *******************************/
// Get Requests
chat_route.get("/:id", verifyAccessToken, ChatController.getUserChat); // To get the chat of the user or create it

// Post Requests

// Patch Requests


/*************************      Admin Side       *******************************/
// Get Requests
chat_route.get("/all-chats", verifyAdminAccessToken, ChatController.getAllChats); // To get all the chats to show in the chat part of admin
chat_route.get("/admin/:id", verifyAdminAccessToken, ChatController.getAllUserChats); // To get the chat of the user or create it

// Post Requests
chat_route.post("/get-user-chat-details", verifyAdminAccessToken, ChatController.getChatDetails); // To get all the chats to show in the chat part of admin

export default chat_route;
