import { UserLoginResponseDto } from "../dtos/user/userLogin.dto";

export default interface IauthService {
  checkMail(recieverEmail: string): Promise<{ status: boolean }>;
  resetPassword(userMail: string, newPassword: string): Promise<any>;
  sendMail(recieverEmail: string, recieverName: string): Promise<any>;
  verifyotp(userEmail: string, userEnteredOTP: string): Promise<boolean>;
  insertuser(
    userFullName: string,
    userName: string,
    userLocation: string,
    userEmail: string,
    userPassword: string
  ): Promise<any>;
  loginVerify(
    userEmail: string,
    userPassword: string
  ): Promise<UserLoginResponseDto>;
  refreshToken(token: string): Promise<any>;
  googleLoginVerify(
    email: string
  ): Promise<{ status: boolean; data: any | null; message: string }>;
  adminRefreshToken(token: string): Promise<any>;
}

export interface UserDataType {
  email: string;
  user_name: string;
  full_name: string;
  role: string;
  location: string;
  password?: string;
  status: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface UserFormDataType {
  email: string;
  user_name: string;
  full_name: string;
  location: string;
  password: string;
}
