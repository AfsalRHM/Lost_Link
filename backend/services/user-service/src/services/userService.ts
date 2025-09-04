import IuserModel from "../interface/IuserModel";
import IuserService, { updateFormDataType } from "../interface/IuserService";

import { StatusCode } from "../constants/statusCodes";
import { UserMapper } from "../mappers/user.mapper";

import { AppError } from "../utils/appError";
import { handleServiceError } from "../utils/errorHandler";

import {
  CreateUserRequestDTO,
  CreateUserResponseDto,
} from "../dtos/user/createUser.dto";
import {
  UpdateUserRequestDto,
  UpdateUserResponseDto,
} from "../dtos/user/updateUser.dto";
import { LoginUserResponseDto } from "../dtos/auth/loginUser.dto";
import { UpdatePasswordResponseDto } from "../dtos/user/updatePassword.dto";
import { GetProfileResponseDto } from "../dtos/user/getProfile.dto";
import { GetUserResponseDTO } from "../dtos/user/getUser.dto";
import { GetAllUsersResponseDto } from "../dtos/admin/getAllUsers.dto";
import { AdminGetUserResponseDto } from "../dtos/admin/getUser.dto";
import { IuserRepository } from "../interface/IuserRepository";

export default class UserService implements IuserService {
  private _userRepository: IuserRepository;

  constructor(userRepository: IuserRepository) {
    this._userRepository = userRepository;
  }

  async checkMail(recieverEmail: string): Promise<{ status: boolean }> {
    try {
      const userData = await this._userRepository.findUser({
        email: recieverEmail,
      });

      return { status: userData ? true : false };
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(error, "Something went wrong while checking email");
    }
  }

  async insertuser(
    userFullName: string,
    userName: string,
    userLocation: string,
    userEmail: string,
    hashedPassword: string
  ): Promise<CreateUserResponseDto> {
    try {
      const data: CreateUserRequestDTO = {
        full_name: userFullName,
        user_name: userName,
        location: userLocation,
        email: userEmail,
        password: hashedPassword,
      };

      const userData = await this._userRepository.insertUser(data);
      if (!userData) {
        throw new AppError(
          "Failed to create user",
          StatusCode.INTERNAL_SERVER_ERROR
        );
      }

      const savedEntity = UserMapper.toEntity(userData);

      return UserMapper.toCreateUserDTO(savedEntity);
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(error, "Something went wrong while inserting user");
    }
  }

  async loginUser(
    userMail: string
  ): Promise<{
    status: boolean;
    data: LoginUserResponseDto | null;
    message: string;
  }> {
    try {
      if (!userMail) {
        throw new AppError("userMail is required", StatusCode.BAD_REQUEST);
      }

      const userData = await this._userRepository.findUser({ email: userMail });
      if (!userData) {
        return {
          status: true,
          data: null,
          message: "User not found",
        };
      }

      const userEntity = UserMapper.toEntity(userData);
      const mappedData = UserMapper.toLoginUserDTO(userEntity);

      return {
        status: true,
        data: mappedData,
        message: "User data for auth fetched successfully",
      };
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(error, "Something went wrong while verifying user");
    }
  }

  async updatePassword(
    userMail: string,
    newPassword: string
  ): Promise<{
    status: boolean;
    data: UpdatePasswordResponseDto;
    message: string;
    email: string;
  }> {
    try {
      const userData = await this._userRepository.updateUserByEmail(
        { email: userMail },
        { password: newPassword }
      );
      if (!userData) {
        throw new AppError(
          "Failed to update password",
          StatusCode.INTERNAL_SERVER_ERROR
        );
      }

      const userEntity = UserMapper.toEntity(userData);
      const mappedData = UserMapper.toUpdatePasswordDTO(userEntity);

      return {
        status: true,
        data: mappedData,
        message: "Password Changed Successfully",
        email: userMail,
      };
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(
        error,
        "Something went wrong while updating user password"
      );
    }
  }

  async getProfile({
    userId,
  }: {
    userId: string | undefined;
  }): Promise<GetProfileResponseDto> {
    try {
      if (!userId) {
        throw new AppError("User ID is required", StatusCode.BAD_REQUEST);
      }

      const userData = await this._userRepository.findUser({ _id: userId });
      if (!userData) {
        throw new AppError("User not found", StatusCode.NOT_FOUND);
      }

      const userEntity = UserMapper.toEntity(userData);

      return UserMapper.toGetProfileDto(userEntity);
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(error, "Something went wrong while checking email");
    }
  }

  async updateUser({
    updateFormData,
    userId,
  }: {
    updateFormData: updateFormDataType;
    userId: string;
  }): Promise<UpdateUserResponseDto> {
    try {
      const { profilePic, fullName, userName, phone } = updateFormData;
      if (!profilePic || !fullName || !userName || !userId) {
        throw new AppError(
          "profilePic, fullName, userName, phone and userId is required",
          StatusCode.BAD_REQUEST
        );
      }

      const userUpdateData: UpdateUserRequestDto = {
        profile_pic: profilePic,
        full_name: fullName,
        user_name: userName,
        phone: phone ? phone : null,
      };

      const userData = await this._userRepository.findUserAndUpdate(
        userId,
        userUpdateData
      );
      if (!userData) {
        throw new AppError(
          "Failed to update password",
          StatusCode.INTERNAL_SERVER_ERROR
        );
      }

      const userEntity = UserMapper.toEntity(userData);

      return UserMapper.toUpdateUserDto(userEntity);
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(error, "Something went wrong while updating user");
    }
  }

  async getUserDataById({
    userId,
  }: {
    userId: string;
  }): Promise<{ status: boolean; data: GetUserResponseDTO; message: string }> {
    try {
      if (!userId) {
        throw new AppError("userId is required", StatusCode.BAD_REQUEST);
      }

      const userData = await this._userRepository.findUser({ _id: userId });
      if (!userData) {
        throw new AppError("User not found", StatusCode.NOT_FOUND);
      }

      const userEntity = UserMapper.toEntity(userData);
      const mappedData = UserMapper.toGetUserDto(userEntity);

      return {
        status: true,
        data: mappedData,
        message: "User Data Available",
      };
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(error, "Something went wrong while fetching user");
    }
  }

  // To get all the users data for the comments live load
  async getUsersDataById({
    userIds,
  }: {
    userIds: string[];
  }): Promise<GetUserResponseDTO[]> {
    try {
      if (!userIds) {
        throw new AppError("userIds are required", StatusCode.BAD_REQUEST);
      }

      const users = await this._userRepository.findSomeUsers({
        _id: { $in: userIds },
      });
      if (!users) {
        throw new AppError("Users not found", StatusCode.NOT_FOUND);
      }

      const filteredUsers = users.map((user) => {
        const savedEntity = UserMapper.toEntity(user);
        console.log("here mimgh have a problem 0989654356");
        return UserMapper.toGetUserDto(savedEntity);
      });

      return filteredUsers;
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(error, "Something went wrong while fetching users");
    }
  }

  async addRequestId({
    requestId,
    userId,
  }: {
    requestId: string;
    userId: string;
  }): Promise<void> {
    try {
      if (!requestId || !userId) {
        throw new AppError(
          "userId and requestId are required",
          StatusCode.BAD_REQUEST
        );
      }

      const userData = await this._userRepository.findByIdAndAddRequestId(
        userId,
        requestId
      );
      if (!userData) {
        throw new AppError("User not found", StatusCode.NOT_FOUND);
      }

      return;
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(
        error,
        "Something went wrong while adding request id to the user"
      );
    }
  }

  // Add the Completed Request Details to the User Data
  async addCompletedRequestDetails({
    requestId,
    userId,
    points,
    rewardAmount,
  }: {
    requestId: string;
    userId: string;
    points: number;
    rewardAmount: number;
  }): Promise<void> {
    try {
      if (!requestId || !userId || !points || !rewardAmount) {
        throw new AppError(
          "requestId, userId, points and rewardAmount are required"
        );
      }

      const userData: IuserModel | null =
        await this._userRepository.findByIdAndAddCompletedRequestIdAndPoints(
          userId,
          requestId,
          points,
          rewardAmount
        );
      if (!userData) {
        throw new AppError("User not found", StatusCode.NOT_FOUND);
      }

      return;
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(
        error,
        "Something went wrong while adding completed reqeust to the user"
      );
    }
  }

  /****************************           Admin Side             **************************************/
  async getUsers({
    search,
    limit,
    page,
  }: {
    search: string;
    limit: number;
    page: number;
  }): Promise<any> {
    try {
      const skip = (page - 1) * limit;
      const filter = search
        ? {
            $or: [
              { user_name: { $regex: search, $options: "i" } },
              { full_name: { $regex: search, $options: "i" } },
              { email: { $regex: search, $options: "i" } },
            ],
          }
        : {};

      const response = await this._userRepository.findUsers(
        filter,
        skip,
        limit
      );

      const mappedUsers = response.data.map((user: IuserModel) => {
        const savedEntity = UserMapper.toEntity(user);
        return UserMapper.toGetAllUsersDto(savedEntity);
      });
      response.data = mappedUsers;

      return response;
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(error, "Something went wrong while fetching users");
    }
  }

  async getAllUsers(): Promise<GetAllUsersResponseDto[] | []> {
    try {
      const response = await this._userRepository.findAllUsers();

      const mappedUsers = response.map((user: IuserModel) => {
        const savedEntity = UserMapper.toEntity(user);
        return UserMapper.toGetAllUsersDto(savedEntity);
      });

      return mappedUsers;
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(
        error,
        "Something went wrong while fetching all users"
      );
    }
  }

  // To get the user details to the admin side
  async getUserData({
    userId,
  }: {
    userId: string;
  }): Promise<AdminGetUserResponseDto> {
    try {
      if (!userId) {
        throw new AppError("userId is required", StatusCode.BAD_REQUEST);
      }

      const userData = await this._userRepository.findUser({ _id: userId });
      if (!userData) {
        throw new AppError("user not found", StatusCode.NOT_FOUND);
      }

      const userEntity = UserMapper.toEntity(userData);

      return UserMapper.toAdminGetUserDto(userEntity);
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(error, "Something went wrong while fetching user");
    }
  }

  async changeUserStatus({
    userId,
  }: {
    userId: string;
  }): Promise<{ status: boolean; data: any; message: string }> {
    try {
      if (!userId) {
        throw new AppError("userId is required", StatusCode.BAD_REQUEST);
      }

      const userData = await this._userRepository.changeStatus(userId);
      if (!userData) {
        throw new AppError("user not found", StatusCode.NOT_FOUND);
      }

      const userEntity = UserMapper.toEntity(userData);
      const mappedData = UserMapper.toGetAllUsersDto(userEntity);

      return {
        status: true,
        data: mappedData,
        message: "User status changed",
      };
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(
        error,
        "Something went wrong while updating user status"
      );
    }
  }
}
