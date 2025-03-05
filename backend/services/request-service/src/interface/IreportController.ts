import { Request, Response } from "express";

export default interface IreportController {
  createReport(req: Request, res: Response): Promise<void>;
  getMyReports(req: Request, res: Response): Promise<void>;
}
