import IuserModel from "./IuserModel";

export interface IauthService {
  sendMail(recieverEmail: string, recieverName: string): Promise<void>;
  checkMail(recieverEmail: string): Promise<boolean>;
  verifyotp(userEmail: string, userEnteredOTP: string): Promise<boolean>;
  insertuser(
    userFullName: string,
    userName: string,
    userLocation: string,
    userEmail: string,
    userPassword: string
  ): Promise<any>;
  loginVerify(userEmail: string, userPassword: string): Promise<any>;
}
