import configCommunication, { getChannel } from "../config/communicationConfig";
import authService, {
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
        console.log(messageContent);
        if (messageContent) {
          correlationId = messageContent.correlationId;
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
          } else if (
            msg?.properties?.headers?.source == "Admin Access Token Validator"
          ) {
            if (messageContent) {
              const response = await _authService.verifyAdminAccessToken(
                messageContent
              );
              channel.sendToQueue(
                "ADMIN",
                Buffer.from(JSON.stringify(response)),
                {
                  correlationId: msg.properties.correlationId,
                  headers: {
                    source: "Admin Access Token Verification",
                    correlationIdIdentifier: messageContent.props.token,
                  },
                }
              );
            } else {
              console.log("Error on messageContent on auth managing Queue 8");
            }
          } else if (
            msg?.properties?.headers?.source == "Admin Refresh Token Validator"
          ) {
            if (messageContent) {
              const response = await _authService.verifyAdminRefreshToken(
                messageContent
              );
              channel.sendToQueue(
                "ADMIN",
                Buffer.from(JSON.stringify(response)),
                {
                  correlationId: msg.properties.correlationId,
                  headers: {
                    source: "Admin Refresh Token Verification",
                    correlationIdIdentifier: messageContent.props.token,
                  },
                }
              );
            } else {
              console.log("Error on messageContent on auth managing Queue 8");
            }
          } else if (
            msg?.properties?.headers?.source == "Create New Admin Access Token"
          ) {
            if (messageContent) {
              const response = await _authService.createAdminRefreshToken(
                messageContent
              );
              channel.sendToQueue(
                "ADMIN",
                Buffer.from(JSON.stringify(response)),
                {
                  correlationId: msg.properties.correlationId,
                  headers: {
                    source: "New Admin Access Token",
                    correlationIdIdentifier: messageContent.props.email,
                  },
                }
              );
            } else {
              console.log("Error on messageContent on auth managing Queue 8");
            }
          } else if (
            msg?.properties?.headers?.source == "User Access Token Validator"
          ) {
            if (messageContent) {
              const response = await _authService.verifyUserAccessToken(
                messageContent
              );
              channel.sendToQueue(
                "ADMIN",
                Buffer.from(JSON.stringify(response)),
                {
                  correlationId: msg.properties.correlationId,
                  headers: {
                    source: "User Access Token Verification",
                    correlationIdIdentifier: messageContent.props.token,
                  },
                }
              );
            } else {
              console.log("Error on messageContent on auth managing Queue 8");
            }
          } else if (msg?.properties?.headers?.source == "user login info") {
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
