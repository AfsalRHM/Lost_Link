export default interface IchatService {
  getUserChat({
    userId,
    requestId,
  }: {
    userId: string;
    requestId: string;
  }): Promise<any>;
  getAllChats(): Promise<any>;
  getChatDetails({ chatId }: { chatId: string }): Promise<any>
}
