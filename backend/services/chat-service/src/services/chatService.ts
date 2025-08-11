import IchatService from "../interface/IchatService";
import IchatModel from "../interface/IchatModel";

import { IchatRepository } from "../interface/IchatRepository";
import { ImessageRepository } from "../interface/ImessageRepository";

import sendToService from "../rabbitmq/producer";
import { StatusCode } from "../constants/statusCodes";

import eventEmitter from "../utils/eventEmitter";
import { createCorrelationId } from "../utils/correlationId";
import { AppError } from "../utils/appError";
import { handleServiceError } from "../utils/errorHandler";

export default class ChatService implements IchatService {
  private _chatRepository: IchatRepository;
  private _messageRepository: ImessageRepository;

  constructor(
    chatRepository: IchatRepository,
    messageRespository: ImessageRepository
  ) {
    this._chatRepository = chatRepository;
    this._messageRepository = messageRespository;
  }

  // Function to Get the Chat if created OR Create the Chat
  async getUserChat({
    userId,
    requestId,
  }: {
    userId: string;
    requestId: string;
  }): Promise<any> {
    try {
      if (!userId || !requestId) {
        throw new AppError(
          "userId and requestId is required",
          StatusCode.BAD_REQUEST
        );
      }

      let chatData = await this._chatRepository.findChat({
        is_group_chat: false,
        user_id: userId,
        request_id: requestId,
      });

      // For the User Data
      const replyQueue = process.env.USER_QUEUE;
      const correlationId = createCorrelationId(userId);

      // For the Request Data
      const replyQueue2 = process.env.REQUEST_QUEUE;
      const correlationId2 = createCorrelationId(requestId);

      if (!replyQueue || !replyQueue2) {
        throw new Error(
          "replyQueue or replyQueue2 env is not accessible, from chat service"
        );
      }

      let props: { userId: string; requestId: string } = {
        userId,
        requestId,
      };

      // Change to the GRPC
      // For the User Data
      sendToService({
        sendingTo: replyQueue,
        correlationId: correlationId,
        correlationIdIdentifier: userId,
        source: "get user data by userId",
        props,
      });

      // For the User Data
      const userDataResponse: any = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Response timeout"));
        }, 10000);

        eventEmitter.once(correlationId, (data) => {
          clearTimeout(timeout);
          resolve(data);
        });
      });

      // For the Request Data
      sendToService({
        sendingTo: replyQueue2,
        correlationId: correlationId2,
        correlationIdIdentifier: requestId,
        source: "get request data by requestId",
        props,
      });

      // For the Request Data
      const requestDataResponse: any = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Response timeout"));
        }, 10000);

        eventEmitter.once(correlationId2, (data) => {
          clearTimeout(timeout);
          resolve(data);
        });
      });

      if (!userDataResponse || !requestDataResponse) {
        throw new AppError(
          "Data is not available through rabbitmq",
          StatusCode.INTERNAL_SERVER_ERROR
        );
      }

      if (chatData) {
        return {
          chatData: chatData,
          userData: userDataResponse.data,
        };
      } else {
        const chatDataToInsert = {
          user_name: userDataResponse.data.fullName,
          user_id: userDataResponse.data.id,
          request_name: requestDataResponse._doc.product_name,
          request_id: requestDataResponse._doc._id,
          request_status: requestDataResponse._doc.status,
        };

        const newChatData: IchatModel | null =
          await this._chatRepository.insertChat(chatDataToInsert);
        if (!newChatData) {
          throw new AppError(
            "Failed to create chat",
            StatusCode.INTERNAL_SERVER_ERROR
          );
        }

        // Adding the first Auto Message
        const newChatId: string = newChatData._id as string;
        await this._messageRepository.insertMessage({
          chat: newChatId,
          sender: "admin",
          content: "Hello! How can I assist you today?",
        });

        return {
          chatData: newChatData,
          userData: userDataResponse.data._doc,
        };
      }
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(
        error,
        "Something went wrong while fetching user chat"
      );
    }
  }

  // Fetch All the Chats
  async getAllChats(): Promise<any> {
    try {
      const chatData = await this._chatRepository.findManyChats({
        latest_message: { $exists: true, $ne: null },
      });

      return chatData;
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(
        error,
        "Something went wrong while fetching all chats"
      );
    }
  }

  // Fetch All the Chats
  async getAllUserChats({ userId }: { userId: string }): Promise<any> {
    try {
      if (!userId) {
        throw new AppError("userId is required", StatusCode.BAD_REQUEST);
      }

      const chatData = await this._chatRepository.findManyChats({
        user_id: userId,
        latest_message: { $exists: true, $ne: null },
      });

      return chatData;
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(
        error,
        "Something went wrong while fetching all user chats"
      );
    }
  }

  // To fetch the chat details on the admin side
  async getChatDetails({ chatId }: { chatId: string }): Promise<any> {
    try {
      if (!chatId) {
        throw new AppError("chatId is required", StatusCode.BAD_REQUEST);
      }

      const chatData = await this._chatRepository.findChat({ _id: chatId });
      if (!chatData) {
        throw new AppError("chat not found", StatusCode.NOT_FOUND);
      }

      return chatData;
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(
        error,
        "Something went wrong while fetching chat details"
      );
    }
  }
}

// to access the userDetails from the queue
export function getUserDataByUserId(correlationId: string, params: any) {
  eventEmitter.emit(correlationId, params);
}

// to access the requestDetails from the queue
export function getRequestDataByRequestId(correlationId: string, params: any) {
  eventEmitter.emit(correlationId, params);
}
