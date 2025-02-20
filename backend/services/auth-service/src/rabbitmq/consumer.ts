import configCommunication, { getChannel } from "../config/communicationConfig";
import authService, {
  getUserDataByUserId,
  loginDetails,
  mailDuplicationCheck,
  userDetails,
  userNameForMail,
} from "../services/authService";

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
        let correlationId;
        if (messageContent.correlationId) {
          correlationId = messageContent.correlationId;
        } else if (msg.properties.correlationId) {
          correlationId = msg.properties.correlationId;
        } else {
          console.log("Message content not available");
        }

        if (correlationId) {
          if (
            msg.properties.correlationId == correlationId &&
            msg?.properties?.headers?.source == "user register complete info"
          ) {
            if (messageContent) {
              userDetails(correlationId, messageContent);
            } else {
              console.log("Error on messageContent on auth managing Queue 1");
            }
          } else if (msg?.properties?.headers?.source == "user login request response") {
            if (messageContent) {
              loginDetails(correlationId, messageContent);
            } else {
              console.log("Error on messageContent on auth managing Queue 2");
            }
          } else if (
            msg?.properties?.headers?.source == "user mail duplication"
          ) {
            if (messageContent) {
              mailDuplicationCheck(correlationId, messageContent);
            } else {
              console.log("Error on messageContent on auth managing Queue 3");
            }
          } else if (
            msg?.properties?.headers?.source == "user name in the user data"
          ) {
            if (messageContent) {
              userNameForMail(correlationId, messageContent);
            } else {
              console.log("Error on messageContent on auth managing Queue 4");
            }
          } else if (msg?.properties?.headers?.source == "password changed") {
            if (messageContent) {
              userDetails(correlationId, messageContent);
            } else {
              console.log("Error on messageContent on auth managing Queue 5");
            }
          } else if (
            msg?.properties?.headers?.source ==
            "get user data by userId response"
          ) {
            if (messageContent) {
              getUserDataByUserId(correlationId, messageContent);
            } else {
              console.log("Error on messageContent on auth managing Queue 5");
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
