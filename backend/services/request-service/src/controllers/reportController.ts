import { Request, Response } from "express";

import reportService from "../services/reportService";
import IreportController from "../interface/IreportController";

export default class ReportController implements IreportController {
  private _reportService: reportService;

  constructor() {
    this._reportService = new reportService();
  }

  // To insert comments
  public createReport = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.body.requestId || !req.body.reportReason || !req.body.userId) {
        res.status(400).json({
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
        res.status(200).json(response);
      } else {
        res.status(400).json(response);
      }
    } catch (error) {
      console.log("error in createComment/commentController", error);
    }
  };

  // To get comments of a request
  public getRequestReports = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      if (!req.body.requestId) {
        res.status(400).json({
          status: false,
          message: "No Data found on the createComment Post Request",
        });
        return;
      }

      //   const response = await this._reportService.getRequestReports({
      //     requestId: req.body.requestId,
      //     commentCount: req.body.count,
      //   });

      //   if (response.status) {
      //     res.status(200).json(response);
      //   } else {
      //     res.status(400).json(response);
      //   }
    } catch (error) {
      console.log("error in getRequestComments/commentController", error);
    }
  };
}
