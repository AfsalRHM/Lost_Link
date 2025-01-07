export default interface IauthService {
  checkMail(recieverEmail: string): Promise<boolean>;
  resetPassword(userMail: string, newPassword: string): Promise<any>;
  sendMail(recieverEmail: string, recieverName: string): Promise<void>;
  verifyotp(userEmail: string, userEnteredOTP: string): Promise<boolean>;
  insertuser(
    userFullName: string,
    userName: string,
    userLocation: string,
    userEmail: string,
    userPassword: string
  ): Promise<any>;
  loginVerify(userEmail: string, userPassword: string): Promise<any>;
  refreshToken(
    token: string
  ): Promise<{ status: boolean; message: string } | undefined>;
  googleLoginVerify(
    email: string
  ): Promise<{ status: boolean; data: UserDataType | null; message: string }>;
}

export interface UserDataType {
  email: string;
  user_name: string;
  full_name: string;
  location: string;
  password?: string;
  status: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
