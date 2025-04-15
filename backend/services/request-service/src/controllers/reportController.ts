import { Request, Response } from "express";

import reportService from "../services/reportService";
import IreportController from "../interface/IreportController";
import { StatusCode } from "../constants/statusCodes";

export default class ReportController implements IreportController {
  private _reportService: reportService;

  constructor() {
    this._reportService = new reportService();
  }

  // To insert comments
  public createReport = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.body.requestId || !req.body.reportReason || !req.body.userId) {
        res.status(StatusCode.BAD_REQUEST).json({
          status: false,
          message: "No Data found on the create Report Post Request",
        });
        return;
      }

      const response = await this._reportService.createReport({
        requestId: req.body.requestId,
        reportReason: req.body.reportReason,
        userId: req.body.userId,
      });

      if (response.status) {
        res.status(StatusCode.OK).json(response);
      } else {
        res.status(StatusCode.BAD_REQUEST).json(response);
      }
    } catch (error) {
      console.log("error in createReport/reportController", error);
    }
  };

  // To get reports of a specfic user
  public getMyReports = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.body.userId) {
        res.status(StatusCode.BAD_REQUEST).json({
          status: false,
          message: "No Data found on the getMyReports Post Request",
        });
        return;
      }

      const response = await this._reportService.getMyReports({
        userId: req.body.userId,
      });

      if (response.status) {
        res.status(StatusCode.OK).json(response);
      } else {
        res.status(StatusCode.BAD_REQUEST).json(response);
      }
    } catch (error) {
      console.log("error in getMyReports/reportController", error);
    }
  };
}
