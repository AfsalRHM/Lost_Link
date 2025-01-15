import { Request, Response } from "express";

export default interface IrequestController {
  createRequest(req: Request, res: Response): Promise<void>;
}
