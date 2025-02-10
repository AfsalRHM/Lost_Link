import IchatService from "../interface/IchatService";
import chatRepository from "../repositories/chatRepository";

import { createCorrelationId } from "../utils/correlationId";
import eventEmitter from "../utils/eventEmitter";
import sendToService from "../rabbitmq/producer";

export default class chatService implements IchatService {
  private _chatRepository: chatRepository;

  constructor() {
    this._chatRepository = new chatRepository();
  }

  // Function to Get the Chat if created OR Create the Chat
  async getUserChat({ userId }: { userId: string }): Promise<any> {
    try {
      let chatData = await this._chatRepository.findOne({
        is_group_chat: false,
        users: { $elemMatch: { $eq: userId } },
      });

      const replyQueue = process.env.USER_QUEUE;
      const correlationId = createCorrelationId(userId);

      if (!replyQueue) {
        throw new Error("replyQueue is empty...!");
      }

      let props: { userId?: string } = {};

      if (userId) {
        props.userId = userId;
      }

      sendToService({
        sendingTo: replyQueue,
        correlationId: correlationId,
        correlationIdIdentifier: userId,
        source: "get user data by userId",
        props,
      });

      const userDataResponse: any = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Response timeout"));
        }, 10000);

        eventEmitter.once(correlationId, (data) => {
          clearTimeout(timeout);
          resolve(data);
        });
      });

      if (userDataResponse.status) {
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
            chat_name: "sender",
            users: [userId],
          };
          const newChatData = await this._chatRepository.insertChat(
            chatDataToInsert
          );
          if (newChatData) {
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
        throw new Error("User Data Didn't get");
      }
    } catch (error) {
      console.log(error, "error on the getUserChat/chatService");
      return false;
    }
  }

  async fetchChats(): Promise<any> {
    try {
      
    } catch (error) {
      console.log(error, "error on the fetchChats/chatService");
      return false;
    }
  }
}

// to access the userDetails from the queue after registration
export function getUserDataByUserId(correlationId: string, params: any) {
  eventEmitter.emit(correlationId, params);
}
