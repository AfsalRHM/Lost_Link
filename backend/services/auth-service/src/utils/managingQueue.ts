import configCommunication, { getChannel } from "../config/communicationConfig";
import authService, { userDetails } from "../services/authService";
import { getCorrelationId } from "./correlationId";

export async function manageQueue() {
  try {
    const _authService = new authService();
    // Configuration of RabbitMQ
    await configCommunication();
    const channel = getChannel();

    console.log("Auth is Consuming of Queue...");

    // Setting up the Consumer
    channel.consume("AUTH", async (msg) => {
      console.log("Consumer Queue triggered");

      if (msg) {
        const messageContent = JSON.parse(msg.content.toString());

        const correlationId = getCorrelationId(messageContent.email);

        if (correlationId) {
          if (msg.properties.correlationId == correlationId) {
            if (messageContent) {
              userDetails(correlationId, messageContent);
            }
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
