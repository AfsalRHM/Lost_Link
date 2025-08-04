import express from "express";
const message_route = express.Router();

import MessageService from "../services/messageService";
import MessageController from "../controllers/messageController";

const messageService = new MessageService();
const messageController = new MessageController(messageService);

/*************************      User Side       *******************************/
// Get Requests
message_route.get("/:id/messages", messageController.getMessages); // To get all the messages of a praticular chat

// Post Requests
message_route.post("/send-message", messageController.sendMessage); // To send/create a new message

/*************************      Admin Side       *******************************/
// Get Requests
message_route.get("/admin/:id/messages", messageController.getMessages); // To get all the messages of a praticular chat

// Post Requests
message_route.post("/send-admin-message", messageController.sendAdminMessage); // To send/create a new message

export default message_route;
