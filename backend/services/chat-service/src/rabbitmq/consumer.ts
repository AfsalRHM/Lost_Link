import configCommunication, { getChannel } from "../config/communicationConfig";
import chatService, { getUserDataByUserId } from "../services/chatService";
import dotenv from "dotenv";
import { getCorrelationId } from "../utils/correlationId";

export async function manageQueue() {
  try {
    dotenv.config();
    const _chatService = new chatService();
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
        console.log(msg.properties);
        console.log(messageContent);

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
          //   const response = await _chatService.insertuser(
          //     messageContent.full_name,
          //     messageContent.user_name,
          //     messageContent.location,
          //     messageContent.email,
          //     messageContent.password
          //   );

          //   channel.sendToQueue("AUTH", Buffer.from(JSON.stringify(response)), {
          //     correlationId: msg.properties.correlationId,
          //     headers: { source: "user register complete info" },
          //   });
          if (messageContent && correlationId) {
            getUserDataByUserId(correlationId, messageContent);
          } else {
            console.log("Error on messageContent on admin managing Queue 2");
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
