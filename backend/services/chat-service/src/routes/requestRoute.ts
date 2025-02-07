import express from "express";
const chat_route = express.Router();

import chatController from "../controllers/chatController";
import verifyAccessToken from "../middlewares/jwtVerifyUser";

const ChatController = new chatController();

/*************************      User Side       *******************************/
// Get Requests
// request_route.get("/getAllRequests", verifyAccessToken, RequestController.getAllRequests); // To get all the requests to show in the request part

// Post Requests

// Patch Requests


/*************************      Admin Side       *******************************/
// Get Requests

// Post Requests

export default chat_route;
