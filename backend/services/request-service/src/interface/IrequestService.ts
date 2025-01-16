export default interface IrequestService {
  insertRequest({
    accessToken,
    formData,
  }: {
    accessToken: string;
    formData: FormData;
  }): Promise<any>;
  changeRequestStatus(props: { requestId: string }): Promise<any>;
}
