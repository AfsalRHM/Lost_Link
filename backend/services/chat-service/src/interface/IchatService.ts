export default interface IchatService {
  getUserChat(recieverEmail: string): Promise<any>
}