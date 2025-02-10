export default interface IchatService {
  getUserChat({ userId }: { userId: string }): Promise<any>
}