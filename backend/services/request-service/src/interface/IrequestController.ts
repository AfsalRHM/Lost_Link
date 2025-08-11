import { NextFunction, Request, Response } from "express";

export default interface IrequestController {
  createRequest(req: Request, res: Response, next: NextFunction): Promise<void>;
  managePayment(req: Request, res: Response, next: NextFunction): Promise<void>;
  getUserRequests(req: Request, res: Response, next: NextFunction): Promise<void>;
  getRequestDetails(req: Request, res: Response, next: NextFunction): Promise<void>;
  getMyRequestDetails(req: Request, res: Response, next: NextFunction): Promise<void>
  createRedeemRequest(req: Request, res: Response, next: NextFunction): Promise<void>;
  getUserRedeemRequests(req: Request, res: Response, next: NextFunction): Promise<void>;
  getRedeemRequestDetails(req: Request, res: Response, next: NextFunction): Promise<void>;

  cancelRequest(req: Request, res: Response, next: NextFunction): Promise<void>;
  changeLikeStatus(req: Request, res: Response, next: NextFunction): Promise<void>;

  getAllRequests(req: Request, res: Response, next: NextFunction): Promise<void>;
  changeRequestStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
  getAllRedeemRequests(req: Request, res: Response, next: NextFunction): Promise<void>;

  adminGetAllRequests(req: Request, res: Response, next: NextFunction): Promise<void>
  adminGetRequestDetails(req: Request, res: Response, next: NextFunction): Promise<void>;

  changeRedeemRequestStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
}
