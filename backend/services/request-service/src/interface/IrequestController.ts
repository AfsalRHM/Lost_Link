import { Request, Response } from "express";

export default interface IrequestController {
  createRequest(req: Request, res: Response): Promise<void>;
  managePayment(req: Request, res: Response): Promise<void>;
  getUserRequests(req: Request, res: Response): Promise<void>;
  getRequestDetails(req: Request, res: Response): Promise<void>;
  cancelRequest(req: Request, res: Response): Promise<void>;
  createRedeemRequest(req: Request, res: Response): Promise<void>;
  getUserRedeemRequests(req: Request, res: Response): Promise<void>;
  getRedeemRequestDetails(req: Request, res: Response): Promise<void>;

  getAllRequests(req: Request, res: Response): Promise<void>;
  changeRequestStatus(req: Request, res: Response): Promise<void>;
  getAllRedeemRequests(req: Request, res: Response): Promise<void>;

  adminGetRequestDetails(req: Request, res: Response): Promise<void>;
}
