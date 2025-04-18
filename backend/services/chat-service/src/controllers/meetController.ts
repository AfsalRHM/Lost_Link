import { Request, Response } from "express";
import ImeetController from "../interface/ImeetController";
import meetService from "../services/meetService";
import { StatusCode } from "../constants/statusCodes";

export default class meetController implements ImeetController {
  private _meetService: meetService;

  constructor() {
    this._meetService = new meetService();
  }

  // To Create/Schedule a meet
  public createMeet = async (req: Request, res: Response): Promise<void> => {
    try {
      const { date, time, userId, requestId, userName } = req.body;
      if (!date || !time || !userId || !requestId || !userName) {
        console.log(
          "invalid data passed to the request createMeet/meetController"
        );
        res.status(StatusCode.NOT_FOUND);
        return;
      }

      const response = await this._meetService.createMeet({
        date,
        time,
        userId,
        requestId,
        userName,
      });

      if (response.status) {
        res.status(StatusCode.OK).json(response);
      } else {
        res.status(StatusCode.BAD_REQUEST).json(response);
      }
    } catch (error) {
      console.log("error in createMeet/meetController", error);
      return;
    }
  };

  // To Create/Schedule a meet
  public getAllMeets = async (req: Request, res: Response): Promise<void> => {
    try {
      const response = await this._meetService.getAllMeets();

      if (response.status) {
        res.status(StatusCode.OK).json(response);
      } else {
        res.status(StatusCode.BAD_REQUEST).json(response);
      }
    } catch (error) {
      console.log("error in getAllMeets/meetController", error);
      return;
    }
  };

  // To get Meet data of a single meet
  public getMeetDataAdmin = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { meetId } = req.body;
      if (!meetId) {
        console.log(
          "invalid data passed to the request getMeetDataAdmin/meetController"
        );
        res.status(StatusCode.NOT_FOUND);
        return;
      }
      const response = await this._meetService.getMeetDataAdmin({ meetId });

      if (response.status) {
        res.status(StatusCode.OK).json(response);
      } else {
        res.status(StatusCode.BAD_REQUEST).json(response);
      }
    } catch (error) {
      console.log("error in getMeetDataAdmin/meetController", error);
      return;
    }
  };

  // To get list of meetings of a particular user
  public getUserMeets = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.body;

      if (!userId) {
        console.log(
          "invalid data passed to the request getUserMeets/meetController"
        );
        res.status(StatusCode.NOT_FOUND);
        return;
      }
      const response = await this._meetService.getUserMeets({ userId });

      if (response.status) {
        res.status(StatusCode.OK).json(response);
      } else {
        res.status(StatusCode.BAD_REQUEST).json(response);
      }
    } catch (error) {
      console.log("error in getUserMeets/meetController", error);
      return;
    }
  };
}
