export default interface IuserService {
  insertuser(
    userFullName: string,
    userName: string,
    userLocation: string,
    userEmail: string,
    hashedPassword: string
  ): Promise<any>;
  checkMail(recieverEmail: string): Promise<boolean>;
//   getProfile(req: Request, res: Response): Promise<void>;
}
