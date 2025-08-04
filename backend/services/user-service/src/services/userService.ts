import userRepository from "../repositories/userRepository";

import userModel from "../models/userModel";
import IuserModel from "../interface/IuserModel";

import IuserService, { updateFormDataType } from "../interface/IuserService";

import { AppError } from "../utils/appError";
import { StatusCode } from "../constants/statusCodes";
import { CreateUserRequestDTO } from "../dtos/user/createUser.dto";
import { UserMapper } from "../mappers/user.mapper";
import { handleServiceError } from "../utils/errorHandler";

export default class UserService implements IuserService {
  private _userRepository: userRepository;

  constructor() {
    this._userRepository = new userRepository(userModel);
  }

  async checkMail(
    recieverEmail: string
  ): Promise<{ status: boolean; data: any; message: string; email: string }> {
    try {
      const userData = await this._userRepository.findUser(recieverEmail);
      if (!userData) {
        throw new AppError("user not found", StatusCode.NOT_FOUND);
      }

      return {
        status: true,
        data: !!userData,
        message: userData
          ? "Email already registered"
          : "Registration Sucessfull",
        email: recieverEmail,
      };
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
  ): Promise<any> {
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

      return UserMapper.toResponseDTO(savedEntity);
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
  ): Promise<{ status: boolean; data: any; message: string }> {
    try {
      const userData = await this._userRepository.findUser(userMail);
      if (!userData) {
        throw new AppError("User not found", StatusCode.NOT_FOUND);
      }

      return {
        status: true,
        data: userData,
        message: "Login Successfull",
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
  ): Promise<{ status: boolean; data: any; message: string; email: string }> {
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

      return {
        status: true,
        data: userData,
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
  }): Promise<IuserModel> {
    try {
      if (!userId) {
        throw new AppError("User ID is required", StatusCode.BAD_REQUEST);
      }

      const userData = await this._userRepository.findOne({ _id: userId });
      if (!userData) {
        throw new AppError("User not found", StatusCode.NOT_FOUND);
      }

      return userData;
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
  }): Promise<IuserModel> {
    try {
      if (!updateFormData || !userId) {
        throw new AppError(
          "Formdata and userId is required",
          StatusCode.BAD_REQUEST
        );
      }

      const userUpdateData = {
        profile_pic: updateFormData.profilePic,
        full_name: updateFormData.fullName,
        user_name: updateFormData.userName,
        phone: updateFormData.phone,
      };

      const userData = await this._userRepository.findByIdAndUpdate(
        userId,
        userUpdateData
      );
      if (!userData) {
        throw new AppError(
          "Failed to update password",
          StatusCode.INTERNAL_SERVER_ERROR
        );
      }

      return userData;
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

  async getUserDataById({ userId }: { userId: string }): Promise<any> {
    try {
      if (!userId) {
        throw new AppError("userId is required", StatusCode.BAD_REQUEST);
      }

      const userData = await this._userRepository.findOne({ _id: userId });
      if (!userData) {
        throw new AppError("User not found", StatusCode.NOT_FOUND);
      }

      const { password, ...newUserData } = userData;
      return {
        status: true,
        data: newUserData,
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
  }): Promise<Partial<IuserModel>[]> {
    try {
      if (!userIds) {
        throw new AppError("userIds are required", StatusCode.BAD_REQUEST);
      }

      const users = await this._userRepository.findMany({
        _id: { $in: userIds },
      });
      if (!users) {
        throw new AppError("Users not found", StatusCode.NOT_FOUND);
      }

      const filteredUsers = users.map((user) => {
        const { password, ...rest } = user.toObject();
        return rest;
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
  async getAllUsers(): Promise<IuserModel[]> {
    try {
      const userList = await this._userRepository.findAll();

      return userList;
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
  async getUserData({ userId }: { userId: string }): Promise<IuserModel> {
    try {
      if (!userId) {
        throw new AppError("userId is required", StatusCode.BAD_REQUEST);
      }

      const userData = await this._userRepository.findOne({ _id: userId });
      if (!userData) {
        throw new AppError("user not found", StatusCode.NOT_FOUND);
      }

      return userData;
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

      return {
        status: true,
        data: userData,
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
