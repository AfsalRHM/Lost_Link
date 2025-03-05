export default interface IreportService {
  createReport({
    requestId,
    reportReason,
    userId,
  }: {
    requestId: string;
    reportReason: string;
    userId: string;
  }): Promise<any>;

  getMyReports({ userId }: { userId: string }): Promise<any>;
}
