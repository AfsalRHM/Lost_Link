import { NextFunction, Request, Response } from "express";

import IreportController from "../interface/IreportController";
import IreportService from "../interface/IreportService";

import { StatusCode } from "../constants/statusCodes";
import { AppError } from "../utils/appError";

export default class ReportController implements IreportController {
  private _reportService: IreportService;

  constructor(reportService: IreportService) {
    this._reportService = reportService;
  }

  // To insert report
  public createReport = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { requestId, reportReason, userId } = req.body;
      if (!requestId || !reportReason || !userId) {
        throw new AppError(
          "requestId, reportReason and userId is required",
          StatusCode.BAD_REQUEST
        );
      }

      const report = await this._reportService.createReport({
        requestId,
        reportReason,
        userId,
      });

      res
        .status(StatusCode.OK)
        .json({ status: true, data: report, message: "Report created" });
    } catch (error) {
      console.log("error in createReport/reportController", error);
      next(error);
    }
  };

  // To get reports of a specfic user
  public getMyReports = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.params.id;
      if (!userId) {
        throw new AppError("userId is required", StatusCode.BAD_REQUEST);
      }

      const reports = await this._reportService.getMyReports({
        userId,
      });

      res.status(StatusCode.OK).json({
        status: true,
        data: reports,
        message: "Fetched all the user's reports",
      });
    } catch (error) {
      console.log("error in getMyReports/reportController", error);
      next(error);
    }
  };
}
