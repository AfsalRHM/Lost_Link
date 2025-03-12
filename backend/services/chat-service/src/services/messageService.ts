import ImessageService from "../interface/ImessageService";
import messageRepository from "../repositories/messageRepository";

import chatRepository from "../repositories/chatRepository";

export default class messageService implements ImessageService {
  private _messageRepository: messageRepository;
  private _chatRepository: chatRepository;

  constructor() {
    this._messageRepository = new messageRepository();
    this._chatRepository = new chatRepository();
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
      if (!userId || !chatId) {
        return {
          status: false,
          data: null,
          message: "Data no Reached to the sendMessage/messageService",
        };
      }

      const newMessage = {
        sender: userId,
        content: content,
        chat: chatId,
        image: image,
      };

      const messageData = await (
        await this._messageRepository.insert(newMessage)
      ).populate("chat");

      if (!messageData) {
        return {
          status: false,
          data: null,
          message:
            "Error while inserting the message on the sendMessage/messageService",
        };
      }

      await this._chatRepository.findByIdAndUpdate(chatId, {
        latest_message: messageData,
      });

      return {
        status: true,
        data: messageData,
        message: "New Message Created",
      };
    } catch (error) {
      console.log(error, "error on the sendMessage/messageService");
      return false;
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
      if (!adminId || !chatId) {
        return {
          status: false,
          data: null,
          message: "Data no Reached to the sendMessage/messageService",
        };
      }

      const newMessage = {
        sender: adminId,
        content: content,
        chat: chatId,
        image: image,
      };

      const messageData = await (
        await this._messageRepository.insert(newMessage)
      ).populate("chat");

      if (!messageData) {
        return {
          status: false,
          data: null,
          message:
            "Error while inserting the message on the sendAdminMessage/messageService",
        };
      }

      await this._chatRepository.findByIdAndUpdate(chatId, {
        latest_message: messageData,
      });

      return {
        status: true,
        data: messageData,
        message: "New Message Created",
      };
    } catch (error) {
      console.log(error, "error on the sendAdminMessage/messageService");
      return false;
    }
  }

  // To get all the messages of a specific chat
  async getMessages({ chatId }: { chatId: string }): Promise<any> {
    try {
      if (!chatId) {
        return {
          status: false,
          data: null,
          message: "Data no Reached to the sendMessage/messageService",
        };
      }

      const AllMessages = await this._messageRepository.findSome({
        chat: chatId,
      });

      if (!AllMessages) {
        return {
          status: false,
          data: null,
          message:
            "Error while Getting all the messages on the getMessages/messageService",
        };
      }

      return {
        status: true,
        data: AllMessages,
        message: "Messages Found",
      };
    } catch (error) {
      console.log(error, "error on the getMessages/messageService");
      return false;
    }
  }
}

// to access the userDetails from the queue after registration
// export function getUserDataByUserId(correlationId: string, params: any) {
//   eventEmitter.emit(correlationId, params);
// }
