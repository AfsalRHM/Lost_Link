import IuserModel from "./IuserModel";

export default interface IuserService {
  checkMail(recieverEmail: string): Promise<{
    status: boolean;
    data: any;
    message: string;
    email: string;
  }>;
  insertuser(
    userFullName: string,
    userName: string,
    userLocation: string,
    userEmail: string,
    hashedPassword: string
  ): Promise<IuserModel>;
  loginUser(
    userMail: string
  ): Promise<{ status: boolean; data: any; message: string }>;
  updatePassword(userMail: string, newPassword: string): Promise<any>;
  getAllUsers(): Promise<any>;
  changeUserStatus(props: { userId: string }): Promise<any>;
  getUserDataById({ userId }: { userId: string }): Promise<any>;
  getUsersDataById({
    userIds,
  }: {
    userIds: string[];
  }): Promise<Partial<IuserModel>[]>;
  getProfile({ userId }: { userId: string | undefined }): Promise<IuserModel>;
  updateUser({
    updateFormData,
    userId,
  }: {
    updateFormData: updateFormDataType;
    userId: string;
  }): Promise<IuserModel>;
  addRequestId({
    requestId,
    userId,
  }: {
    requestId: string;
    userId: string;
  }): Promise<any>;
  addCompletedRequestDetails({
    requestId,
    userId,
    points,
    rewardAmount,
  }: {
    requestId: string;
    userId: string;
    points: number;
    rewardAmount: number;
  }): Promise<void>;
  getUserData({ userId }: { userId: string }): Promise<IuserModel>;
}

export interface updateFormDataType {
  profilePic: string | undefined;
  fullName: string | undefined;
  userName: string | undefined;
  email: string | undefined;
  phone: number | null | undefined;
}
