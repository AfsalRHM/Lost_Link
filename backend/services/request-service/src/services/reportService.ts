import IreportService from "../interface/IreportService";
import sendToService from "../rabbitmq/producer";
import reportRepository from "../repositories/reportRepository";
import { createCorrelationId } from "../utils/correlationId";
import eventEmitter from "../utils/eventEmitter";

export default class reportService implements IreportService {
  private _reportRepository: reportRepository;

  constructor() {
    this._reportRepository = new reportRepository();
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
        return {
          status: false,
          data: null,
          message: "Data not reached on createReport/reportService",
        };
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

      if (reportData) {
        return {
          status: true,
          data: reportData,
          message: "New Report Created",
        };
      } else {
        return {
          status: false,
          data: null,
          message: "Failed to create new Report",
        };
      }
    } catch (error) {
      return {
        status: false,
        data: null,
        message: "Error on createReport/reportService",
      };
    }
  }
}

// to access the userDetails from the queue after comment creation
export function getUserDataByUserId(correlationId: string, params: any) {
  eventEmitter.emit(correlationId, params);
}
