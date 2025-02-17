export default interface ImessageService {
  sendMessage({
    userId,
    content,
    chatId,
  }: {
    userId: string;
    content: string;
    chatId: string;
  }): Promise<any>;
  getMessages({ chatId }: { chatId: string }): Promise<any>;
}
