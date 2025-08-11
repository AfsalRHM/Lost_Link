import chatModel from "../model/chatModel";
import chatRepository from "../repositories/chatRepository";

import { ImessageRepository } from "../interface/ImessageRepository";

import { StatusCode } from "../constants/statusCodes";

import ImessageService from "../interface/ImessageService";
import { AppError } from "../utils/appError";
import { handleServiceError } from "../utils/errorHandler";
import { IchatRepository } from "../interface/IchatRepository";

export default class MessageService implements ImessageService {
  private _messageRepository: ImessageRepository;
  private _chatRepository: IchatRepository;

  constructor(
    messageRepository: ImessageRepository,
    chatRepository: IchatRepository
  ) {
    this._messageRepository = messageRepository;
    this._chatRepository = chatRepository;
  }

  // Function to Send/Create a User Message
  async sendMessage({
    content,
    chatId,
    userId,
    image,
  }: {
    userId: string;
    content: string;
    chatId: string;
    image: string;
  }): Promise<any> {
    try {
      if (!userId || !chatId || !content || !image) {
        throw new AppError(
          "userId, content, chatId and image is required",
          StatusCode.BAD_REQUEST
        );
      }

      const newMessage = {
        sender: userId,
        content: content,
        chat: chatId,
        image: image,
      };

      const messageData = await this._messageRepository.insertMessage(
        newMessage
      );
      if (!messageData) {
        throw new AppError(
          "Failed to create user message",
          StatusCode.INTERNAL_SERVER_ERROR
        );
      }

      await this._chatRepository.findMessageAndUpdate(
        { _id: chatId },
        {
          latest_message: messageData,
        }
      );

      return messageData;
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(
        error,
        "Something went wrong while creating user message"
      );
    }
  }

  // Function to Send/Create an Admin Message
  async sendAdminMessage({
    content,
    chatId,
    adminId,
    image,
  }: {
    adminId: string;
    content: string;
    chatId: string;
    image: string;
  }): Promise<any> {
    try {
      if (!adminId || !chatId || !content || !image) {
        throw new AppError(
          "adminId, content, chatId and image is required",
          StatusCode.BAD_REQUEST
        );
      }

      const newMessage = {
        sender: adminId,
        content: content,
        chat: chatId,
        image: image,
      };

      const messageData = await this._messageRepository.insertMessage(
        newMessage
      );
      if (!messageData) {
        throw new AppError(
          "Failed to create admin message",
          StatusCode.INTERNAL_SERVER_ERROR
        );
      }

      await this._chatRepository.findMessageAndUpdate(
        { _id: chatId },
        {
          latest_message: messageData,
        }
      );

      return messageData;
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }
      handleServiceError(
        error,
        "Something went wrong while creating admin message"
      );
    }
  }

  // To get all the messages of a specific chat
  async getMessages({ chatId }: { chatId: string }): Promise<any> {
    try {
      if (!chatId) {
        throw new AppError("chatId is required", StatusCode.BAD_REQUEST);
      }

      const AllMessages = await this._messageRepository.findMessages({
        chat: chatId,
      });

      return AllMessages;
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(error, "Something went wrong while fetching messages");
    }
  }
}
