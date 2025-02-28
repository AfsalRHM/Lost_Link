import { Request, Response } from "express";

export default interface IreportController {
  createReport(req: Request, res: Response): Promise<void>;
  getRequestReports(req: Request, res: Response): Promise<void>;
}
