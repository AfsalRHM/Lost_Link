import { GetAllUsersResponseDto } from "../dtos/admin/getAllUsers.dto";
import { AdminGetUserResponseDto } from "../dtos/admin/getUser.dto";
import { CreateUserResponseDto } from "../dtos/user/createUser.dto";
import { GetProfileResponseDto } from "../dtos/user/getProfile.dto";
import { GetUserResponseDTO } from "../dtos/user/getUser.dto";
import { UpdatePasswordResponseDto } from "../dtos/user/updatePassword.dto";
import { UpdateUserResponseDto } from "../dtos/user/updateUser.dto";

export default interface IuserService {
  checkMail(recieverEmail: string): Promise<{ status: boolean }>;
  insertuser(
    userFullName: string,
    userName: string,
    userLocation: string,
    userEmail: string,
    hashedPassword: string
  ): Promise<CreateUserResponseDto>;
  loginUser(
    userMail: string
  ): Promise<{ status: boolean; data: any; message: string }>;
  updatePassword(
    userMail: string,
    newPassword: string
  ): Promise<{
    status: boolean;
    data: UpdatePasswordResponseDto;
    message: string;
    email: string;
  }>;
  getAllUsers(): Promise<GetAllUsersResponseDto[] | null>;
  changeUserStatus(props: { userId: string }): Promise<any>;
  getUserDataById({
    userId,
  }: {
    userId: string;
  }): Promise<{ status: boolean; data: GetUserResponseDTO; message: string }>;
  getUsersDataById({
    userIds,
  }: {
    userIds: string[];
  }): Promise<GetUserResponseDTO[]>;
  getProfile({
    userId,
  }: {
    userId: string | undefined;
  }): Promise<GetProfileResponseDto>;
  updateUser({
    updateFormData,
    userId,
  }: {
    updateFormData: updateFormDataType;
    userId: string;
  }): Promise<UpdateUserResponseDto>;
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
  getUserData({ userId }: { userId: string }): Promise<AdminGetUserResponseDto>;
}

export interface updateFormDataType {
  profilePic: string | undefined;
  fullName: string | undefined;
  userName: string | undefined;
  phone: number | null | undefined;
}
