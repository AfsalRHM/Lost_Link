import express from "express";
const chat_route = express.Router();

import chatController from "../controllers/chatController";
import verifyAccessToken, { verifyAdminAccessToken } from "../middlewares/jwtVerifyUser";

const ChatController = new chatController();

/*************************      User Side       *******************************/
// Get Requests

// Post Requests
chat_route.post("/getUserChat", verifyAccessToken, ChatController.getUserChat); // To get all the requests to show in the request part

// Patch Requests


/*************************      Admin Side       *******************************/
// Get Requests
chat_route.get("/all-chats", verifyAdminAccessToken, ChatController.getAllChats); // To get all the chats to show in the chat part of admin

// Post Requests

export default chat_route;
