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

        if (messageContent.userData) {
          const response = await _userService.insertuser(
            messageContent.userData.full_name,
            messageContent.userData.user_name,
            messageContent.userData.location,
            messageContent.userData.email,
            messageContent.userData.password
          );

          channel.sendToQueue("AUTH", Buffer.from(JSON.stringify(response)), {
            correlationId: msg.properties.correlationId,
          });
        } else {
          console.log("No userData found in message.");
        }

        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error("Error setting up RabbitMQ communication:", error);
  }
}
