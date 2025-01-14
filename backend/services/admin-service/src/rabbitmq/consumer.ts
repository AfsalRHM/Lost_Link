import configCommunication, { getChannel } from "../config/communicationConfig";
import adminService, {
  userDataStatusChange,
  userList,
} from "../services/adminService";
import { getCorrelationId } from "../utils/correlationId";

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
          correlationId = getCorrelationId(
            msg?.properties?.headers?.correlationIdString
          );
        } else {
          console.log("Message content not available");
        }

        if (correlationId) {
          if (msg?.properties?.headers?.source == "all user resoponse") {
            if (messageContent) {
              userList(correlationId, messageContent);
            } else {
              console.log("Error on messageContent on admin managing Queue 1");
            }
          } else if (
            msg?.properties?.headers?.source == "status changed response"
          ) {
            if (messageContent) {
              userDataStatusChange(correlationId, messageContent);
            } else {
              console.log("Error on messageContent on admin managing Queue 2");
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
