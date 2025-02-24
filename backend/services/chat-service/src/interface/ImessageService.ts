export default interface ImessageService {
  sendMessage({
    userId,
    content,
    chatId,
    image,
  }: {
    userId: string;
    content: string;
    chatId: string;
    image: string;
  }): Promise<any>;
  sendAdminMessage({
    content,
    chatId,
    adminId,
  }: {
    adminId: string;
    content: string;
    chatId: string;
  }): Promise<any>;
  getMessages({ chatId }: { chatId: string }): Promise<any>;
}
