import configCommunication, { getChannel } from "../config/communicationConfig";
import userService from "../services/userService";

export async function manageQueue() {
  try {
    const _userService = new userService();
    // Configuration of RabbitMQ
    await configCommunication();
    const channel = getChannel();

    console.log("User is listening of Queue...");

    // Setting up the Consumer
    channel.consume("USER", async (msg) => {
      console.log("Consumer Queue triggered");

      if (msg) {
        const messageContent = JSON.parse(msg.content.toString());

        console.log(msg, "this is the msg");

        if (msg?.properties?.headers?.source == "user data insert request") {
          const response = await _userService.insertuser(
            messageContent.full_name,
            messageContent.user_name,
            messageContent.location,
            messageContent.email,
            messageContent.password
          );

          channel.sendToQueue("AUTH", Buffer.from(JSON.stringify(response)), {
            correlationId: msg.properties.correlationId,
            headers: { source: "user register complete info" },
          });
        } else if (msg?.properties?.headers?.source == "user login request") {
          const response = await _userService.loginUser(
            messageContent.userMail
          );

          channel.sendToQueue("AUTH", Buffer.from(JSON.stringify(response)), {
            correlationId: msg.properties.correlationId,
            headers: { source: "user login info" },
          });
        } else if (
          msg?.properties?.headers?.source == "user mail duplication request"
        ) {
          const response = await _userService.checkMail(
            messageContent.userMail
          );

          channel.sendToQueue("AUTH", Buffer.from(JSON.stringify(response)), {
            correlationId: msg.properties.correlationId,
            headers: { source: "user mail duplication" },
          });
        } else if (
          msg?.properties?.headers?.source == "user name for mail request"
        ) {
          const response = await _userService.checkMail(
            messageContent.userMail
          );

          channel.sendToQueue("AUTH", Buffer.from(JSON.stringify(response)), {
            correlationId: msg.properties.correlationId,
            headers: { source: "user name in the user data" },
          });
        } else if (
          msg?.properties?.headers?.source == "new password to save to user"
        ) {
          const response = await _userService.updatePassword(
            messageContent.userMail,
            messageContent.newPassword
          );

          channel.sendToQueue("AUTH", Buffer.from(JSON.stringify(response)), {
            correlationId: msg.properties.correlationId,
            headers: { source: "password changed" },
          });
        } else if (
          msg?.properties?.headers?.source == "Change the User Status"
        ) {
          const response = await _userService.changeUserStatus(
            messageContent.props
          );

          channel.sendToQueue("ADMIN", Buffer.from(JSON.stringify(response)), {
            correlationId: msg.properties.correlationId,
            headers: {
              source: "status changed response",
              correlationIdIdentifier:
                msg?.properties?.headers?.correlationIdString,
            },
          });
        } else if (
          msg?.properties?.headers?.source == "get user data by userId"
        ) {
          console.log("This the message content", messageContent);
          const response = await _userService.getUserDataById(messageContent);

          channel.sendToQueue(
            msg.properties.replyTo,
            Buffer.from(JSON.stringify(response)),
            {
              correlationId: msg.properties.correlationId,
              headers: {
                source: "get user data by userId response",
                correlationIdIdentifier:
                  msg?.properties?.headers?.correlationIdString,
              },
            }
          );
        } else if (
          msg?.properties?.headers?.source == "Add the request Id to the user"
        ) {
          console.log(messageContent);
          await _userService.addRequestId(messageContent.props);
        } else {
          console.log("No userData found in message.");
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
