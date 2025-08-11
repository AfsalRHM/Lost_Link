import ImeetService from "../interface/ImeetService";
import { ImeetRepository } from "../interface/ImeetRepository";

import { StatusCode } from "../constants/statusCodes";

import { AppError } from "../utils/appError";
import { handleServiceError } from "../utils/errorHandler";

export default class MeetService implements ImeetService {
  private _meetRepository: ImeetRepository;

  constructor(meetRepository: ImeetRepository) {
    this._meetRepository = meetRepository;
  }

  // To Create/Schedule Meet
  async createMeet({
    date,
    time,
    userId,
    requestId,
    userName,
  }: {
    date: string;
    time: string;
    userId: string;
    requestId: string;
    userName: string;
  }): Promise<any> {
    try {
      if (!date || !time || !userId || !requestId || !userName) {
        throw new AppError(
          "data, time, userId, requesId and userName is required",
          StatusCode.BAD_REQUEST
        );
      }

      const meetDate = new Date(`${date}T${time}`);

      const meetData = await this._meetRepository.insertMeet({
        meet_date: meetDate,
        meet_time: time,
        user_id: userId,
        request_id: requestId,
        user_name: userName,
      });
      if (!meetData) {
        throw new AppError(
          "Failed to create meet",
          StatusCode.INTERNAL_SERVER_ERROR
        );
      }

      return meetData;
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(error, "Something went wrong while creating meet");
    }
  }

  // To get all the meets for the admin
  async getAllMeets(): Promise<any> {
    try {
      const meetData = await this._meetRepository.findAllMeets();

      return meetData;
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(error, "Something went wrong while fetching meets");
    }
  }

  // To get a single meet data
  async getMeetDataAdmin({ meetId }: { meetId: string }): Promise<any> {
    try {
      if (!meetId) {
        throw new AppError("meetId is required", StatusCode.BAD_REQUEST);
      }

      const meetData = await this._meetRepository.findMeet({ _id: meetId });
      if (!meetData) {
        throw new AppError("meet not found", StatusCode.NOT_FOUND);
      }

      return meetData;
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(
        error,
        "Something went wrong while fetching meet for admin"
      );
    }
  }

  // To get a single meet data
  async getUserMeets({ userId }: { userId: string }): Promise<any> {
    try {
      if (!userId) {
        throw new AppError("userId is required", StatusCode.BAD_REQUEST);
      }

      const meetData = await this._meetRepository.findManyMeet({
        user_id: userId,
      });

      return meetData;
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(
        error,
        "Something went wrong while fetching user meets"
      );
    }
  }
}
