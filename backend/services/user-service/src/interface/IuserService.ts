export default interface IuserService {
  checkMail(recieverEmail: string): Promise<any>;
  insertuser(
    userFullName: string,
    userName: string,
    userLocation: string,
    userEmail: string,
    hashedPassword: string
  ): Promise<any>;
  checkMail(recieverEmail: string): Promise<boolean>;
  loginUser(userMail: string): Promise<any>;
  updatePassword(userMail: string, newPassword: string): Promise<any>;
  getAllUsers(): Promise<any>;
  changeUserStatus(props: { userId: string }): Promise<any>;
}
