import express from "express";
const chat_route = express.Router();

import chatController from "../controllers/chatController";
import verifyAccessToken from "../middlewares/jwtVerifyUser";

const ChatController = new chatController();

/*************************      User Side       *******************************/
// Get Requests
chat_route.get("/getUserChat", verifyAccessToken, ChatController.getUserChat); // To get all the requests to show in the request part

chat_route.get("/ha", (req, res) => {
    res.send("Hahahah");
    res.end();
})

// Post Requests

// Patch Requests


/*************************      Admin Side       *******************************/
// Get Requests

// Post Requests

export default chat_route;
