import configCommunication, { getChannel } from "../config/communicationConfig";
import chatService, {
  getRequestDataByRequestId,
  getUserDataByUserId,
} from "../services/chatService";
import dotenv from "dotenv";
import { getCorrelationId } from "../utils/correlationId";
import ChatRepository from "../repositories/chatRepository";
import chatModel from "../model/chatModel";
import MessageRepository from "../repositories/messageRepository";
import messageModel from "../model/messageModel";

export async function manageQueue() {
  try {
    dotenv.config();

    const messageRepository = new MessageRepository(messageModel);
    const chatRepository = new ChatRepository(chatModel);
    const _chatService = new chatService(chatRepository, messageRepository);
    // Configuration of RabbitMQ
    await configCommunication();
    const channel = getChannel();

    console.log("Chat is Consuming to the Queue...");

    const CHAT_QUEUE = process.env.CHAT_QUEUE;

    if (!CHAT_QUEUE) {
      console.log("not getting the queue");
    }

    // Setting up the Consumer
    channel.consume(CHAT_QUEUE!, async (msg) => {
      console.log("Consumer Queue triggered");

      if (msg) {
        const messageContent = JSON.parse(msg.content.toString());

        let correlationId;

        if (messageContent) {
          correlationId = getCorrelationId(
            msg?.properties?.headers?.correlationIdIdentifier
          );
        } else {
          console.log("Message content not available");
        }

        if (
          msg?.properties?.headers?.source == "get user data by userId response"
        ) {
          if (messageContent && correlationId) {
            getUserDataByUserId(correlationId, messageContent);
          } else {
            console.log("Error on messageContent on admin managing Queue 2");
          }
        } else if (
          msg?.properties?.headers?.source ==
          "get request data by requestId response"
        ) {
          if (messageContent && correlationId) {
            getRequestDataByRequestId(correlationId, messageContent);
          } else {
            console.log("Error on messageContent on admin managing Queue 3");
          }
        } else {
          console.log("No requestData found in message.");
        }

        channel.ack(msg);
      } else {
        console.log("No correlation id provided");
      }
    });
  } catch (error) {
    console.error("Error setting up RabbitMQ communication:", error);
  }
}
