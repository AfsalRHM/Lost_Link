export default interface IrequestService {
  insertRequest({
    accessToken,
    formData,
  }: {
    accessToken: string;
    formData: FormData;
  }): Promise<any>;
  getUserRequests(requestIds: [string]): Promise<any>;
  getRequestDetails(requestIds: [string]): Promise<any>;
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
  getUserRedeemRequests({ userId }: { userId: string }): Promise<any>;

  getRequests(): Promise<any>;
  changeRequestStatus(props: { requestId: string }): Promise<any>;
  getAllRedeemRequests(): Promise<any>;
}
