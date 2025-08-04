import reportRepository from "../repositories/reportRepository";
import reportModel from "../models/reportModel";

import IreportService from "../interface/IreportService";
import IrequestService from "../interface/IrequestService";

import sendToService from "../rabbitmq/producer";
import { createCorrelationId } from "../utils/correlationId";
import eventEmitter from "../utils/eventEmitter";
import { AppError } from "../utils/appError";
import { StatusCode } from "../constants/statusCodes";
import { handleServiceError } from "../utils/errorHandler";

export default class ReportService implements IreportService {
  private _reportRepository: reportRepository;
  private _requestService: IrequestService;

  constructor(requestService: IrequestService) {
    this._reportRepository = new reportRepository(reportModel);
    this._requestService = requestService;
  }

  async createReport({
    requestId,
    reportReason,
    userId,
  }: {
    requestId: string;
    reportReason: string;
    userId: string;
  }): Promise<any> {
    try {
      if (!requestId || !reportReason || !userId) {
        throw new AppError("requestId, reportReason and userId is required");
      }

      const sendingTo = process.env.USER_QUEUE;
      const correlationId = createCorrelationId(requestId);
      const source = "get user data by userId";
      const props = {
        userId,
      };

      if (!sendingTo) {
        throw new Error("sendingTo is emplty...");
      }

      sendToService({
        sendingTo,
        source,
        correlationId: correlationId,
        props,
      });

      const userData: any = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Response timeout"));
        }, 10000);

        eventEmitter.once(correlationId, (data) => {
          clearTimeout(timeout);
          resolve(data);
        });
      });

      const report = {
        request_id: requestId,
        user_id: userId,
        user_name: userData.data._doc.full_name,
        reason: reportReason,
      };

      const reportData = await this._reportRepository.insert(report);
      if (!reportData) {
        throw new AppError(
          "Failed to create report",
          StatusCode.INTERNAL_SERVER_ERROR
        );
      }

      return reportData;
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(error, "Something went wrong while inserting report");
    }
  }

  // To get all the reports of a specific user
  async getMyReports({ userId }: { userId: string }): Promise<any> {
    try {
      if (!userId) {
        throw new AppError("userId is required", StatusCode.BAD_REQUEST);
      }

      const reportData = await this._reportRepository.findAll({
        user_id: userId,
      });

      const enrichedReports = await Promise.all(
        reportData.map(async (report) => {
          const requestData = await this._requestService.getRequestDataById({
            requestId: report.request_id,
          });
          return {
            ...report.toObject(),
            title: requestData.product_name || "Unknown Product",
          };
        })
      );

      return enrichedReports;
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(error, "Something went wrong while fetching reports");
    }
  }
}

// to access the userDetails from the queue after comment creation
export function getUserDataByUserId(correlationId: string, params: any) {
  eventEmitter.emit(correlationId, params);
}
