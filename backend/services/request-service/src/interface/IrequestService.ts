export default interface IrequestService {
  insertRequest({
    accessToken,
    formData,
  }: {
    accessToken: string;
    formData: FormData;
  }): Promise<any>;
  getUserRequests(requestIds: [string]): Promise<any>;
  getRequestDetails({
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
  }: {
    requestId: string;
    formData: any;
  }): Promise<any>;
  getRedeemRequestDetails({
    requestRedeemId,
  }: {
    requestRedeemId: string;
  }): Promise<any>;

  getRequests(): Promise<any>;
  changeRequestStatus(props: { requestId: string }): Promise<any>;
  getAllRedeemRequests(): Promise<any>;

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
}
