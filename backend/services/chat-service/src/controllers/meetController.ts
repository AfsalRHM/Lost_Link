import { NextFunction, Request, Response } from "express";

import ImeetController from "../interface/ImeetController";
import ImeetService from "../interface/ImeetService";

import { StatusCode } from "../constants/statusCodes";
import { AppError } from "../utils/appError";

export default class MeetController implements ImeetController {
  private _meetService: ImeetService;

  constructor(meetService: ImeetService) {
    this._meetService = meetService;
  }

  // To Create/Schedule a meet
  public createMeet = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { date, time, userId, requestId, userName } = req.body;
      if (!date || !time || !userId || !requestId || !userName) {
        throw new AppError(
          "data, time, userId, requesId and userName is required",
          StatusCode.BAD_REQUEST
        );
      }

      const meet = await this._meetService.createMeet({
        date,
        time,
        userId,
        requestId,
        userName,
      });

      res
        .status(StatusCode.OK)
        .json({ status: true, data: meet, message: "Meet created" });
    } catch (error) {
      console.log("error in createMeet/meetController", error);
      next(error);
    }
  };

  // To Create/Schedule a meet
  public getAllMeets = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const meets = await this._meetService.getAllMeets();

      res
        .status(StatusCode.OK)
        .json({ status: true, data: meets, message: "All meets fetched" });
    } catch (error) {
      console.log("error in getAllMeets/meetController", error);
      next(error);
    }
  };

  // To get Meet data of a single meet
  public getMeetDataAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const meetId = req.params.id;
      if (!meetId) {
        throw new AppError("meetId is required", StatusCode.BAD_REQUEST);
      }

      const meet = await this._meetService.getMeetDataAdmin({ meetId });

      res.status(StatusCode.OK).json({
        status: true,
        data: meet,
        message: "Meet details fetched for admin",
      });
    } catch (error) {
      console.log("error in getMeetDataAdmin/meetController", error);
      next(error);
    }
  };

  // To get list of meetings of a particular user
  public getUserMeets = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.params.id;
      if (!userId) {
        throw new AppError("userId is required", StatusCode.BAD_REQUEST);
      }

      const meets = await this._meetService.getUserMeets({ userId });

      res
        .status(StatusCode.OK)
        .json({ status: true, data: meets, message: "User meets fetched" });
    } catch (error) {
      console.log("error in getUserMeets/meetController", error);
      next(error);
    }
  };
}
