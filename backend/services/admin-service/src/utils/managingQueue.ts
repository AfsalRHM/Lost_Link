import configCommunication, {getChannel} from "../config/communicationConfig";
import adminService from "../services/adminService";
import { getCorrelationId } from "./correlationId";

export async function manageQueue() {
  try {
    const _adminService = new adminService();
    // Configuration of RabbitMQ
    await configCommunication();
    const channel = getChannel();

    console.log("Admin is Consuming of Queue...");

    // Setting up the Consumer
    channel.consume("ADMIN", async (msg) => {
      console.log("Consumer Queue triggered");

      if (msg) {
        const messageContent = JSON.parse(msg.content.toString());
        let correlationId;
        if (messageContent) {
          correlationId = getCorrelationId(messageContent.email);
        } else {
          console.log("Message content not available");
        }

        if (correlationId) {
          if (
            msg.properties.correlationId == correlationId &&
            msg?.properties?.headers?.source == "user register complete info"
          ) {
            // if (messageContent) {
            //   _adminService.userDetails(correlationId, messageContent);
            // } else {
            //   console.log("Error on messageContent on auth managing Queue 1");
            // }
          } else {
            console.log(
              "No consume found because the correlation id dosen't match."
            );
          }
        } else {
          console.log("Correlation id not provided...");
        }

        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error("Error setting up RabbitMQ communication:", error);
  }
}
