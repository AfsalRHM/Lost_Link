export default interface ImeetService {
  createMeet({
    date,
    time,
    userId,
    requestId,
    userName
  }: {
    date: string;
    time: string;
    userId: string;
    requestId: string;
    userName: string;
  }): Promise<any>;
  getAllMeets(): Promise<any>
  getMeetDataAdmin({ meetId }: { meetId: string }): Promise<any>
}
