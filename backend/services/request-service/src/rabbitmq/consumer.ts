import configCommunication, { getChannel } from "../config/communicationConfig";
import requestService from "../services/requestService";
import dotenv from "dotenv";

export async function manageQueue() {
  try {
    dotenv.config();
    const _requestService = new requestService();
    // Configuration of RabbitMQ
    await configCommunication();
    const channel = getChannel();

    console.log("Request is Consuming to the Queue...");

    const REQUEST_QUEUE = process.env.REQUEST_QUEUE;

    if (!REQUEST_QUEUE) {
      console.log('not getting th equee')
    }

    // Setting up the Consumer
    channel.consume(REQUEST_QUEUE!, async (msg) => {
      console.log("Consumer Queue triggered");

      if (msg) {
        const messageContent = JSON.parse(msg.content.toString());

        // if (msg?.properties?.headers?.source == "user data insert request") {
        //   const response = await _userService.insertuser(
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
        // } else {
        //   console.log("No requestData found in message.");
        // }

        channel.ack(msg);
      } else {
        console.log("No correlation id provided");
      }
    });
  } catch (error) {
    console.error("Error setting up RabbitMQ communication:", error);
  }
}
