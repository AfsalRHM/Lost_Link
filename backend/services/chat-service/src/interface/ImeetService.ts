export default interface ImeetService {
  createMeet({
    date,
    time,
    userId,
    requestId,
    userName,
  }: {
    date: string;
    time: string;
    userId: string;
    requestId: string;
    userName: string;
  }): Promise<any>;
  getMeets({
    search,
    limit,
    page,
    activeTab,
  }: {
    search: string;
    limit: number;
    page: number;
    activeTab: string;
  }): Promise<any>;
  getMeetDataAdmin({ meetId }: { meetId: string }): Promise<any>;
  getUserMeets({ userId }: { userId: string }): Promise<any>;
}
