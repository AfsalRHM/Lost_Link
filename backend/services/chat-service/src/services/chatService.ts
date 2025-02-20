import IchatService from "../interface/IchatService";
import chatRepository from "../repositories/chatRepository";
import messageRepository from "../repositories/messageRepository";

import { createCorrelationId } from "../utils/correlationId";
import eventEmitter from "../utils/eventEmitter";
import sendToService from "../rabbitmq/producer";
import IchatModel from "../interface/IchatModel";

export default class chatService implements IchatService {
  private _chatRepository: chatRepository;
  private _messageRepository: messageRepository;

  constructor() {
    this._chatRepository = new chatRepository();
    this._messageRepository = new messageRepository();
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
      let chatData = await this._chatRepository.findOne({
        is_group_chat: false,
        user_id: userId,
      });

      // For the User Data
      const replyQueue = process.env.USER_QUEUE;
      const correlationId = createCorrelationId(userId);

      // For the Request Data
      const replyQueue2 = process.env.REQUEST_QUEUE;
      const correlationId2 = createCorrelationId(requestId);

      if (!replyQueue || !replyQueue2) {
        throw new Error("replyQueue is empty...!");
      }

      let props: { userId?: string; requestId?: string } = {};

      if (userId && requestId) {
        props.userId = userId;
        props.requestId = requestId;
      }

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

      if (userDataResponse.status && requestDataResponse.status) {
        if (chatData) {
          return {
            status: true,
            data: {
              chatData: chatData,
              userData: userDataResponse.data._doc,
            },
            message: "Chat Data Available",
          };
        } else {
          const chatDataToInsert = {
            user_name: userDataResponse.data._doc.full_name,
            user_id: userDataResponse.data._doc._id,
            request_name: requestDataResponse.data.product_name,
            request_id: requestDataResponse.data._id,
            request_status: requestDataResponse.data.status,
          };
          const newChatData: IchatModel | null =
            await this._chatRepository.insertChat(chatDataToInsert);
          if (newChatData) {
            // Add the first Auto Message
            const newChatId: string = newChatData._id as string;
            await this._messageRepository.insertMessage({
              chat: newChatId,
              sender: "admin",
              content: "Hello! How can I assist you today?",
            });
            return {
              status: true,
              data: {
                chatData: newChatData,
                userData: userDataResponse.data._doc,
              },
              message: "Chat Data Available",
            };
          } else {
            return {
              status: false,
              data: null,
              message: "New Chat Data Didn't Created",
            };
          }
        }
      } else {
        throw new Error("User Data or Request Data Didn't get");
      }
    } catch (error) {
      console.log(error, "error on the getUserChat/chatService");
      return {
        status: false,
        data: null,
        message: "Failed to get the User Chat",
      };
    }
  }

  // Fetch All the Chats
  async getAllChats(): Promise<any> {
    try {
      const chatData = await this._chatRepository.findSome({
        latest_message: { $exists: true, $ne: null },
      });

      if (chatData) {
        return {
          status: true,
          data: chatData,
          message: "Fetched all the Chats",
        };
      } else {
        return {
          status: true,
          data: null,
          message: "Chat Data is Empty",
        };
      }
    } catch (error) {
      console.log(error, "error on the getAllChats/chatService");
      return {
        status: false,
        data: null,
        message: "Failed to get all the Chats",
      };
    }
  }

  // To fetch the chat details on the admin side
  async getChatDetails({ chatId }: { chatId: string }): Promise<any> {
    try {
      const chatData = await this._chatRepository.findOne({ _id: chatId });

      if (chatData) {
        return {
          status: true,
          data: chatData,
          message: "Fetched the User's Chat",
        };
      } else {
        return {
          status: true,
          data: null,
          message: "User's Chat Data is Empty",
        };
      }
    } catch (error) {
      console.log(error, "error on the getChatDetails/chatService");
      return {
        status: false,
        data: null,
        message: "Failed to get User's Chat Data",
      };
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
