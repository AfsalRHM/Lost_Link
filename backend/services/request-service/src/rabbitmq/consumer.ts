import dotenv from "dotenv";

import configCommunication, { getChannel } from "../config/communicationConfig";
import sendToService from "./producer";

import {
  getUserDataByUserId,
  getUsersDataByUserId,
} from "../services/commentService";

import requestService from "../services/requestService";
import RequestRepository from "../repositories/requestRepository";
import requestModel from "../models/requestModel";
import RedeemRequestRepository from "../repositories/redeemRequestRepository";
import redeemRequestModel from "../models/redeemRequestModel";
import ReportRepository from "../repositories/reportRepository";
import reportModel from "../models/reportModel";

export async function manageQueue() {
  try {
    dotenv.config();
    const redeemRequestRepository = new RedeemRequestRepository(
      redeemRequestModel
    );
    const reportRepository = new ReportRepository(reportModel);
    const requestRepository = new RequestRepository(requestModel);

    const _requestService = new requestService(
      requestRepository,
      redeemRequestRepository,
      reportRepository
    );
    // Configuration of RabbitMQ
    await configCommunication();
    const channel = getChannel();

    console.log("Request is Consuming to the Queue...");

    const REQUEST_QUEUE = process.env.REQUEST_QUEUE;

    if (!REQUEST_QUEUE) {
      console.log("not getting th equee");
    }

    // Setting up the Consumer
    channel.consume(REQUEST_QUEUE!, async (msg) => {
      console.log("Consumer Queue triggered");

      if (msg) {
        const messageContent = JSON.parse(msg.content.toString());

        if (
          msg?.properties?.headers?.source == "get request data by requestId"
        ) {
          const response = await _requestService.getRequestDataById(
            messageContent
          );

          // channel.sendToQueue(
          //   msg.properties.replyTo,
          //   Buffer.from(JSON.stringify(response)),
          //   {
          //     correlationId: msg.properties.correlationId,
          //     headers: {
          //       source: "get request data by requestId response",
          //       correlationIdIdentifier:
          //         msg?.properties?.headers?.correlationIdString,
          //     },
          //   }
          // );
          sendToService({
            sendingTo: msg.properties.replyTo,
            source: "get request data by requestId response",
            correlationId: msg.properties.correlationId,
            correlationIdIdentifier:
              msg?.properties?.headers?.correlationIdIdentifier,
            props: {
              ...response,
            },
          });
        } else if (
          msg?.properties?.headers?.source == "get user data by userId response"
        ) {
          getUserDataByUserId(msg.properties.correlationId, messageContent);
        } else if (
          msg?.properties?.headers?.source ==
          "get user's data by userId response"
        ) {
          getUsersDataByUserId(msg.properties.correlationId, messageContent);
        } else {
          console.log("No Match Found for the source.");
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
