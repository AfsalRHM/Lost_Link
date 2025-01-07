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
        console.log(msg.content.toString())
        const messageContent = JSON.parse(msg.content.toString());

        if (
          messageContent.userData &&
          msg?.properties?.headers?.source == "user data insert request"
        ) {
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
        } else if (
          messageContent.userMail &&
          msg?.properties?.headers?.source == "user login request"
        ) {
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
        } else if ( msg?.properties?.headers?.source == "get All Users") {
          const response = await _userService.getAllUsers();

          channel.sendToQueue("ADMIN", Buffer.from(JSON.stringify(response)), {
            correlationId: msg.properties.correlationId,
            headers: { source: "all user resoponse", correlationIdString: msg?.properties?.headers?.correlationIdString },
          });
        } else if ( msg?.properties?.headers?.source == "Change the User Status") {
          const response = await _userService.changeUserStatus(messageContent);

          channel.sendToQueue("ADMIN", Buffer.from(JSON.stringify(response)), {
            correlationId: msg.properties.correlationId,
            headers: { source: "status changed response", correlationIdString: msg?.properties?.headers?.correlationIdString },
          });
        } else {
          console.log("No userData found in message.");
        }

        channel.ack(msg);
      } else {
        console.log('No correlation id provided')
      }
    });
  } catch (error) {
    console.error("Error setting up RabbitMQ communication:", error);
  }
}