import express from "express";
const chat_route = express.Router();

import ChatRepository from "../repositories/chatRepository";
import chatModel from "../model/chatModel";
import MessageRepository from "../repositories/messageRepository";
import messageModel from "../model/messageModel";

import ChatController from "../controllers/chatController";
import ChatService from "../services/chatService";

const messageRepository = new MessageRepository(messageModel);
const chatRepository = new ChatRepository(chatModel);

const chatService = new ChatService(chatRepository, messageRepository);
const chatController = new ChatController(chatService);

/*************************      User Side       *******************************/
// Get Requests
chat_route.get("/:id", chatController.getUserChat); // To get the chat of the user or create it

/*************************      Admin Side       *******************************/
// Get Requests
chat_route.get("/all-chats", chatController.getAllChats); // To get all the chats to show in the chat part of admin
chat_route.get("/admin/:id", chatController.getAllUserChats); // To get the chat of the user or create it

// Post Requests
chat_route.post("/get-user-chat-details", chatController.getChatDetails); // To get all the chats to show in the chat part of admin

export default chat_route;
