import { Types } from "mongoose";

import otpModel from "../models/otpModel";
import otpRepository from "../repositories/otpRepository";
import IauthService, { UserDataType } from "../interface/IauthService";

import passwordUtils from "../utils/bcryptPassword";
import jwtFunctions from "../utils/jwt";
import sendMail from "../utils/sendMail";
import {
  clearCorrelationId,
  createCorrelationId,
} from "../utils/correlationId";
import eventEmitter from "../utils/eventEmitter";

import sendToService from "../rabbitmq/producer";

import { IRefreshTokenJwtReturn } from "../interface/IjwtPayload";
import { CreateUserRequestDto } from "../dtos/user/createUser.dto";
import { AppError } from "../utils/appError";
import { StatusCode } from "../constants/statusCodes";
import { handleServiceError } from "../utils/errorHandler";

export default class AuthService implements IauthService {
  private _otpRepository: otpRepository;

  constructor() {
    this._otpRepository = new otpRepository(otpModel);
  }

  // Function to check the user already exists or not
  async checkMail(recieverEmail: string): Promise<boolean> {
    try {
      if (!recieverEmail) {
        throw new AppError("recieverMail is required", StatusCode.BAD_REQUEST);
      }

      const replyQueue = process.env.USER_QUEUE;
      if (!replyQueue) {
        throw new Error("replyQueue env is not accessible, from auth service");
      }

      const correlationId = createCorrelationId(recieverEmail);

      const props: { userMail: string } = {
        userMail: recieverEmail,
      };

      sendToService({
        sendingTo: replyQueue,
        correlationId: correlationId,
        source: "user mail duplication request",
        props,
      });

      const userData: any = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Response timeout"));
        }, 10000);

        eventEmitter.once(correlationId, (data) => {
          clearTimeout(timeout);
          resolve(data);
        });
      });
      if (!userData.data) {
        throw new AppError(
          "Failed to check mail",
          StatusCode.INTERNAL_SERVER_ERROR
        );
      }

      return true;
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(error, "Something went wrong while checking mail");
    }
  }

  async resetPassword(userMail: string, newPassword: string): Promise<any> {
    try {
      if (!userMail || !newPassword) {
        throw new AppError("userMail and newPassword is required");
      }

      const hashedPassword = await passwordUtils.hashPassword(newPassword);

      const replyQueue = process.env.USER_QUEUE;
      if (!replyQueue) {
        throw new Error("replyQueue env is not accessible, from auth service");
      }

      const correlationId = createCorrelationId(userMail);

      const props: { userMail: string; newPassword: string } = {
        userMail,
        newPassword: hashedPassword,
      };

      sendToService({
        sendingTo: replyQueue,
        correlationId: correlationId,
        source: "new password to save to user",
        props,
      });

      const userData: any = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Response timeout"));
        }, 10000);

        eventEmitter.once(correlationId, (data) => {
          clearTimeout(timeout);
          resolve(data);
        });
      });
      if (!userData.data) {
        throw new AppError(
          "Failed to reset password",
          StatusCode.INTERNAL_SERVER_ERROR
        );
      }

      return;
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(error, "Something went wrong while reseting password");
    }
  }

  // Method to Send Mail to the User's Email
  async sendMail(recieverEmail: string, recieverName: string): Promise<any> {
    try {
      if (!recieverName || !recieverEmail) {
        throw new AppError(
          "recieverName and recieverEmail is required",
          StatusCode.BAD_REQUEST
        );
      }

      if (recieverName == "Reset Password") {
        const replyQueue = process.env.USER_QUEUE;
        if (!replyQueue) {
          throw new Error(
            "replyQueue env is not accessible, from auth service"
          );
        }

        const correlationId = createCorrelationId(recieverEmail);

        const props = {
          userMail: recieverEmail,
        };

        sendToService({
          sendingTo: replyQueue,
          correlationId: correlationId,
          source: "user name for mail request",
          props,
        });

        const userData: any = await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error("Response timeout"));
          }, 10000);

          eventEmitter.once(correlationId, (data) => {
            clearTimeout(timeout);
            resolve(data);
          });
        });

        if (!userData.data) {
          throw new AppError(
            "Failed to fetch user name",
            StatusCode.INTERNAL_SERVER_ERROR
          );
        }

        const otp = await sendMail(recieverEmail, userData.user_name);
        if (!otp) {
          throw new AppError(
            "Failed to send mail 1",
            StatusCode.INTERNAL_SERVER_ERROR
          );
        }

        const expire = new Date(Date.now() + 10 * 1000 * 1);

        await this._otpRepository.deleteMany(recieverEmail);

        const data = await this._otpRepository.insertOTP({
          email: recieverEmail,
          otp: otp,
          expires_at: expire,
        });
        if (!data) {
          throw new AppError(
            "Failed to insert otp 1",
            StatusCode.INTERNAL_SERVER_ERROR
          );
        }
      } else {
        const otp = await sendMail(recieverEmail, recieverName);
        if (!otp) {
          throw new AppError(
            "Failed to send mail 2",
            StatusCode.INTERNAL_SERVER_ERROR
          );
        }

        const expire = new Date(Date.now() + 10 * 1000 * 1);

        await this._otpRepository.deleteMany(recieverEmail);

        const data = await this._otpRepository.insertOTP({
          email: recieverEmail,
          otp: otp!,
          expires_at: expire,
        });
        if (!data) {
          throw new AppError(
            "Failed to insert otp 2",
            StatusCode.INTERNAL_SERVER_ERROR
          );
        }

        return;
      }
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(error, "Something went wrong while sending mail");
    }
  }

  // Method to verfiy the user Entered OTP
  async verifyotp(userEmail: string, userEnteredOTP: string): Promise<boolean> {
    try {
      if (!userEmail || !userEnteredOTP) {
        throw new AppError("userEmail and userEnteredOTP is required");
      }

      const otpData = await this._otpRepository.findOTP(userEmail);
      if (!otpData || otpData.otp !== userEnteredOTP) {
        throw new AppError("Invalid or expired OTP", StatusCode.UNAUTHORIZED);
      }

      return true;
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(error, "Something went wrong while verifying otp");
    }
  }

  // Call the insert User Controller from the user Service by RabbitMQ
  async insertuser(
    userFullName: string,
    userName: string,
    userLocation: string,
    userEmail: string,
    userPassword: string
  ): Promise<any> {
    try {
      if (
        !userFullName ||
        !userName ||
        !userLocation ||
        !userEmail ||
        !userPassword
      ) {
        throw new AppError(
          "userFullName, userName, userLocation, userEmail, userPassword is required"
        );
      }

      const hashedPassword: string = await passwordUtils.hashPassword(
        userPassword
      );

      const data: CreateUserRequestDto = {
        full_name: userFullName,
        user_name: userName,
        location: userLocation,
        email: userEmail,
        password: hashedPassword,
      };

      const replyQueue = process.env.USER_QUEUE;
      if (!replyQueue) {
        throw new Error("replyQueue env is not accessible, from auth service");
      }

      const correlationId = createCorrelationId(userEmail);

      const props = {
        userData: data,
      };

      sendToService({
        sendingTo: replyQueue,
        correlationId: correlationId,
        source: "user data insert request",
        props,
      });

      const userData: UserDataType = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Response timeout"));
        }, 10000);

        eventEmitter.once(correlationId, (data) => {
          clearTimeout(timeout);
          resolve(data);
        });
      });
      if (!userData) {
        throw new AppError(
          "Failed to insert user",
          StatusCode.INTERNAL_SERVER_ERROR
        );
      }

      clearCorrelationId(userData.email);
      return userData;
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

  // Function to  verify the User Entries for login
  async loginVerify(userEmail: string, userPassword: string): Promise<any> {
    try {
      const replyQueue = process.env.USER_QUEUE;
      if (!replyQueue) {
        throw new Error("replyQueue env is not accessible, from auth service");
      }

      const correlationId = createCorrelationId(userEmail);

      const props = {
        userMail: userEmail,
      };

      sendToService({
        sendingTo: replyQueue,
        correlationId: correlationId,
        correlationIdentifier: userEmail,
        source: "user login request",
        props,
      });

      const userData: any = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Response timeout"));
        }, 10000);

        eventEmitter.once(correlationId, (data) => {
          clearTimeout(timeout);
          resolve(data);
        });
      });
      if (!userData.data) {
        throw new AppError(
          "Failed to fetch user details",
          StatusCode.INTERNAL_SERVER_ERROR
        );
      }

      const isMatch = await passwordUtils.comparePassword(
        userPassword,
        userData.data.password
      );
      if (!isMatch) {
        throw new AppError("Invalid Credentials", StatusCode.UNAUTHORIZED);
      }

      const plainUserData = userData.data;
      const { password, ...rest } = plainUserData;

      if (rest.status !== "active") {
        throw new AppError(
          "Your account has been blocked",
          StatusCode.FORBIDDEN
        );
      }

      return rest;
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

  async createJwtTokens(messageContent: any): Promise<any> {
    try {
      if (!messageContent) {
        throw new AppError(
          "messageContent is required",
          StatusCode.BAD_REQUEST
        );
      }

      const accessToken = jwtFunctions.generateAdminAccessToken({
        id: messageContent.props.adminId,
        email: messageContent.props.email,
        role: messageContent.props.role,
      });
      const refreshToken = jwtFunctions.generateAdminRefreshToken({
        id: messageContent.props.adminId,
        email: messageContent.props.email,
        role: messageContent.props.role,
      });
      if (!accessToken || !refreshToken) {
        throw new AppError(
          "Failed to generate tokens",
          StatusCode.INTERNAL_SERVER_ERROR
        );
      }

      return { status: true, data: { accessToken, refreshToken } };
    } catch (error) {
      handleServiceError(error, "Something went wrong while creating tokens");
    }
  }

  async verifyAdminAccessToken(messageContent: any): Promise<any> {
    try {
      if (!messageContent) {
        throw new AppError(
          "messageContent is required",
          StatusCode.BAD_REQUEST
        );
      }

      const decoded = jwtFunctions.verifyAdminAccessToken(
        messageContent.props.token
      );
      if (!decoded) {
        throw new AppError("Access token expired", StatusCode.UNAUTHORIZED);
      }

      return {
        status: true,
        message: "Access token verified",
        data: decoded,
      };
    } catch (error) {
      handleServiceError(
        error,
        "Something went wrong while verfying admin access token"
      );
    }
  }

  async verifyAdminRefreshToken(messageContent: any): Promise<any> {
    try {
      if (!messageContent) {
        throw new AppError(
          "messageContent is required",
          StatusCode.BAD_REQUEST
        );
      }

      const decoded = jwtFunctions.verifyAdminRefreshToken(
        messageContent.props.token
      );
      if (!decoded) {
        throw new AppError("Refresh token expired", StatusCode.UNAUTHORIZED);
      }

      return {
        status: true,
        message: "Admin Refresh token verified",
        data: decoded,
      };
    } catch (error) {
      handleServiceError(
        error,
        "Something went wrong while verifyin admin refresh token"
      );
    }
  }

  async createAdminRefreshToken(messageContent: any): Promise<any> {
    try {
      if (!messageContent) {
        throw new AppError(
          "messageContent is required",
          StatusCode.BAD_REQUEST
        );
      }

      const accessToken = jwtFunctions.generateAdminAccessToken({
        id: messageContent.props.adminId,
        email: messageContent.props.email,
        role: messageContent.props.role,
      });
      if (!accessToken) {
        throw new AppError(
          "Failed to create access token",
          StatusCode.INTERNAL_SERVER_ERROR
        );
      }

      return { status: true, data: { accessToken } };
    } catch (error) {
      handleServiceError(
        error,
        "Something went wrong while creating access token"
      );
    }
  }

  async verifyUserAccessToken(messageContent: any): Promise<any> {
    try {
      if (!messageContent) {
        throw new AppError(
          "messageContent is required",
          StatusCode.BAD_REQUEST
        );
      }

      const decoded = jwtFunctions.verifyAccessToken(
        messageContent.props.token
      );
      if (!decoded) {
        throw new AppError("Access token expired", StatusCode.UNAUTHORIZED);
      }

      return {
        status: true,
        message: "Access token verified",
        data: decoded,
      };
    } catch (error) {
      handleServiceError(
        error,
        "Something went wrong while verifying access token"
      );
    }
  }

  // To create a new access token with the existing refresh token
  async refreshToken(token: string): Promise<any> {
    try {
      if (!token) {
        throw new AppError("token is requried", StatusCode.BAD_REQUEST);
      }

      const decoded: IRefreshTokenJwtReturn | null =
        jwtFunctions.verifyRefreshToken(token);
      if (!decoded) {
        throw new AppError("Refresh token expired", StatusCode.UNAUTHORIZED);
      }

      const newUserId: string = new Types.ObjectId(decoded.id).toString();

      const replyQueue = process.env.USER_QUEUE;
      if (!replyQueue) {
        throw new Error("replyQueue env is not accessible, from auth service");
      }

      const correlationId = createCorrelationId(newUserId);

      const props = {
        userId: newUserId,
      };

      sendToService({
        sendingTo: replyQueue,
        correlationId,
        source: "get user data by userId",
        correlationIdentifier: newUserId,
        props,
      });

      const userDataResponse: any = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Response timeout"));
        }, 10000);

        eventEmitter.once(correlationId, (data) => {
          clearTimeout(timeout);
          resolve(data);
        });
      });
      if (!userDataResponse.data) {
        throw new AppError("Failed to fecth user details");
      }

      const newUserData = userDataResponse.data._doc;
      if (newUserData.status !== "active") {
        throw new AppError(
          "You are blocked from this site",
          StatusCode.FORBIDDEN
        );
      }

      const newAccessToken: string = jwtFunctions.generateAccessToken({
        id: newUserData._id,
        email: newUserData.email,
        role: "user",
        name: newUserData.user_name,
      });
      if (!newAccessToken) {
        throw new AppError(
          "Failed to create access token",
          StatusCode.INTERNAL_SERVER_ERROR
        );
      }

      return newAccessToken;
    } catch (error) {
      handleServiceError(
        error,
        "Something went wrong while creating new access token"
      );
    }
  }

  // To create a new admin access token with the existing admin refresh token
  async adminRefreshToken(token: string): Promise<any> {
    try {
      if (!token) {
        throw new AppError("token is requried", StatusCode.BAD_REQUEST);
      }

      const decoded = jwtFunctions.verifyAdminRefreshToken(token);
      if (!decoded) {
        throw new AppError(
          "Admin Refresh token expired",
          StatusCode.UNAUTHORIZED
        );
      }

      const newUserId = new Types.ObjectId(decoded.id).toString();
      const newAccessToken = jwtFunctions.generateAdminAccessToken({
        id: newUserId,
        email: decoded.email,
        role: decoded.role,
      });

      return newAccessToken;
    } catch (error) {
      handleServiceError(
        error,
        "Something went wrong while creating new admin access token"
      );
    }
  }

  async googleLoginVerify(
    email: string
  ): Promise<{ status: boolean; data: any; message: string }> {
    try {
      if (!email) {
        throw new AppError("email is required", StatusCode.BAD_REQUEST);
      }

      const replyQueue = process.env.USER_QUEUE;
      if (!replyQueue) {
        throw new Error("replyQueue env is not accessible, from auth service");
      }

      const correlationId = createCorrelationId(email);

      const props = {
        userMail: email,
      };

      sendToService({
        sendingTo: replyQueue,
        correlationId: correlationId,
        source: "user login request",
        props,
      });

      const userData: any = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Response timeout"));
        }, 10000);

        eventEmitter.once(correlationId, (data) => {
          clearTimeout(timeout);
          resolve(data);
        });
      });
      if (!userData.data) {
        throw new AppError(
          "Failed to fetch user details",
          StatusCode.INTERNAL_SERVER_ERROR
        );
      }

      if (userData.data.status !== "active") {
        throw new AppError(
          "Your account has been blocked",
          StatusCode.FORBIDDEN
        );
      }

      return userData;
    } catch (error) {
      handleServiceError(
        error,
        "Something went wrong while verifying with google"
      );
    }
  }
}

// to access the userDetails from the queue after registration
export function userDetails(correlationId: string, params: any) {
  eventEmitter.emit(correlationId, params);
}

// to access the login User Details from the queus after login
export function loginDetails(correlationId: string, params: string) {
  eventEmitter.emit(correlationId, params);
}

// to access the user mail duplication details from the queus after user enters the mail and request for otp
export function mailDuplicationCheck(correlationId: string, params: string) {
  eventEmitter.emit(correlationId, params);
}

// to access the user mail duplication details from the queus after user enters the mail and request for otp
export function userNameForMail(correlationId: string, params: string) {
  eventEmitter.emit(correlationId, params);
}

// to access the userDetails from the queue after registration
export function getUserDataByUserId(correlationId: string, params: any) {
  eventEmitter.emit(correlationId, params);
}
