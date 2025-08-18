import { adminGetAllRedeemRequestsResponseDto } from "../dtos/redeemRequest/getAllRedeemRequests.dto";
import { AdminGetAllRequestsResponseDto } from "../dtos/request/getAllRequests.dto";

export default interface IrequestService {
  insertRequest({
    userId,
    formData,
  }: {
    userId: string;
    formData: any;
  }): Promise<any>;
  getUserRequests(userId: string): Promise<any>;
  adminGetRequests({
    search,
    limit,
    page,
  }: {
    search: string;
    limit: number;
    page: number;
  }): Promise<any>;
  getRequestDetails({
    requestId,
    userId,
    from,
  }: {
    requestId: string;
    userId: string;
    from: string;
  }): Promise<any>;
  getMyRequestDetails({
    requestId,
    userId,
  }: {
    requestId: string;
    userId: string;
  }): Promise<any>;
  makePayment(formData: any): Promise<any>;
  getRequestDataById({ requestId }: { requestId: string }): Promise<any>;
  createRedeemRequest({
    requestId,
    formData,
    userId,
  }: {
    requestId: string;
    formData: any;
    userId: string;
  }): Promise<any>;
  getRedeemRequestDetails({
    redeemRequestId,
  }: {
    redeemRequestId: string;
  }): Promise<any>;

  getRequests({
    min,
    max,
    location,
  }: {
    min: number;
    max: number;
    location: string;
  }): Promise<any>;
  adminGetAllRequests(): Promise<AdminGetAllRequestsResponseDto[] | []>;
  changeRequestStatus(props: { requestId: string }): Promise<any>;
  adminGetRedeemRequests({
    search,
    limit,
    page,
  }: {
    search: string;
    limit: number;
    page: number;
  }): Promise<any>;
  adminGetAllRedeemRequests(): Promise<
    adminGetAllRedeemRequestsResponseDto[] | []
  >;

  getUserRedeemRequests({ userId }: { userId: string }): Promise<any>;
  changeRedeemRequestStatus(props: {
    redeemRequestId: string;
    changeTo: string;
  }): Promise<any>;

  changeLikeStatus({
    requestId,
    userId,
  }: {
    requestId: string;
    userId: string | undefined;
  }): Promise<any>;

  adminGetRequestDetails({ requestId }: { requestId: string }): Promise<any>;
  cancelRequest({
    requestId,
    userId,
  }: {
    requestId: string;
    userId: string | undefined;
  }): Promise<any>;
}
