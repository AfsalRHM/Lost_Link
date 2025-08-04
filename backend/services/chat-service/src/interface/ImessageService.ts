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
    image,
  }: {
    adminId: string;
    content: string;
    chatId: string;
    image: string;
  }): Promise<any>;
  getMessages({ chatId }: { chatId: string }): Promise<any>;
}
