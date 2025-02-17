import express from "express";
const chat_route = express.Router();

import chatController from "../controllers/chatController";
import verifyAccessToken from "../middlewares/jwtVerifyUser";

const ChatController = new chatController();

/*************************      User Side       *******************************/
// Get Requests

// Post Requests
chat_route.post("/getUserChat", verifyAccessToken, ChatController.getUserChat); // To get all the requests to show in the request part

// Patch Requests


/*************************      Admin Side       *******************************/
// Get Requests

// Post Requests

export default chat_route;
