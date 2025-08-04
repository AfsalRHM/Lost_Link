import { NextFunction, Request, Response } from "express";

export default interface IreportController {
  createReport(req: Request, res: Response, next: NextFunction): Promise<void>;
  getMyReports(req: Request, res: Response, next: NextFunction): Promise<void>;
}
