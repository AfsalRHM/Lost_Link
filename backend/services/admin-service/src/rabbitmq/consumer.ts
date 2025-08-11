import configCommunication, { getChannel } from "../config/communicationConfig";

import adminModel from "../model/adminModel";
import AdminRepository from "../repositories/adminRepository";
import adminService, { userDataStatusChange } from "../services/adminService";

import { getCorrelationId } from "../utils/correlationId";

export async function manageQueue() {
  try {
    const adminRepository = new AdminRepository(adminModel);
    const _adminService = new adminService(adminRepository);
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
            msg?.properties?.headers?.correlationIdIdentifier
          );
        } else {
          console.log("Message content not available");
        }

        if (correlationId) {
          if (msg?.properties?.headers?.source == "status changed response") {
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
