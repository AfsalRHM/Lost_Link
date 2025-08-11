import configCommunication, { getChannel } from "../config/communicationConfig";

import userModel from "../models/userModel";
import UserRepository from "../repositories/userRepository";
import userService from "../services/userService";

export async function manageQueue() {
  try {
    const userRepository = new UserRepository(userModel);
    const _userService = new userService(userRepository);
    // Configuration of RabbitMQ
    await configCommunication();
    const channel = getChannel();

    console.log("User is listening of Queue...");

    // Setting up the Consumer
    channel.consume("USER", async (msg) => {
      console.log("Consumer Queue triggered");

      if (msg) {
        const messageContent = JSON.parse(msg.content.toString());

        if (msg?.properties?.headers?.source == "user data insert request") {
          const response = await _userService.insertuser(
            messageContent.userData.full_name,
            messageContent.userData.user_name,
            messageContent.userData.location,
            messageContent.userData.email,
            messageContent.userData.password
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
            headers: {
              source: "user login request response",
              correlationIdentifier:
                msg.properties.headers.correlationIdentifier,
            },
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
          const response = await _userService.getUserDataById(messageContent);

          channel.sendToQueue(
            msg.properties.replyTo,
            Buffer.from(JSON.stringify(response)),
            {
              correlationId: msg.properties.correlationId,
              headers: {
                source: "get user data by userId response",
                correlationIdIdentifier:
                  msg?.properties?.headers?.correlationIdIdentifier,
              },
            }
          );
        } else if (
          msg?.properties?.headers?.source == "get user's data by userId"
        ) {
          const response = await _userService.getUsersDataById(messageContent);

          channel.sendToQueue(
            msg.properties.replyTo,
            Buffer.from(JSON.stringify(response)),
            {
              correlationId: msg.properties.correlationId,
              headers: {
                source: "get user's data by userId response",
                correlationIdIdentifier:
                  msg?.properties?.headers?.correlationIdIdentifier,
              },
            }
          );
        } else if (
          msg?.properties?.headers?.source == "Add the request Id to the user"
        ) {
          await _userService.addRequestId(messageContent);
        } else if (
          msg?.properties?.headers?.source ==
          "Add the completed request details to the user"
        ) {
          await _userService.addCompletedRequestDetails(messageContent);
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
