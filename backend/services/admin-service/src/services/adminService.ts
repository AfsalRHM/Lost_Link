import sendToService from "../rabbitmq/producer";

import IadminService from "../interface/IadminService";
import { IadminRepository } from "../interface/IadminRepository";
import { IserviceResponseType } from "../interface/IresponseTypes";

import eventEmitter from "../utils/eventEmitter";
import jwtFunctions from "../utils/jwt";
import { createCorrelationId } from "../utils/correlationId";
import { AppError } from "../utils/appError";
import { handleServiceError } from "../utils/errorHandler";

import { StatusCode } from "../constants/statusCodes";
import { AdminMapper } from "../mappers/admin.mapper";

import { AdminLoginDTO } from "../dtos/AdminLoginDTO";
import { InsertAdminDTO } from "../dtos/InsertAdminDTO";
import { ChangeAdminStatusDTO } from "../dtos/ChangeAdminStatusDTO";
import { ChangeUserStatusDTO } from "../dtos/ChangeUserStatusDTO";
import { RefreshTokenDTO } from "../dtos/RefreshTokenDTO";

export default class AdminService implements IadminService {
  private _adminRepository: IadminRepository;

  constructor(adminRepository: IadminRepository) {
    this._adminRepository = adminRepository;
  }

  async adminLogin({ email, password }: AdminLoginDTO): Promise<any> {
    try {
      if (!email || !password) {
        throw new AppError(
          "email and password is required",
          StatusCode.BAD_REQUEST
        );
      }

      const adminData = await this._adminRepository.findAdmin(email);
      if (!adminData) {
        throw new AppError("Admin not found", StatusCode.NOT_FOUND);
      }

      if (adminData.password !== password) {
        throw new AppError("Invalid credentials", StatusCode.FORBIDDEN);
      }

      const newAccessToken = jwtFunctions.generateAdminAccessToken({
        id: adminData._id.toString(),
        email: adminData.email,
        role: adminData.role,
      });
      const newRefreshToken = jwtFunctions.generateAdminRefreshToken({
        id: adminData._id.toString(),
        email: adminData.email,
        role: adminData.role,
      });
      if (!newAccessToken || !newRefreshToken) {
        throw new AppError(
          "Failed to generate authentication tokens",
          StatusCode.INTERNAL_SERVER_ERROR
        );
      }

      let responseData: {
        adminData: any;
        accessToken: string;
        refreshToken: string;
      };

      responseData = {
        adminData,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };

      return responseData;
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(error, "Something went wrong while verifying admin");
    }
  }

  async getAllUsers(): Promise<IserviceResponseType> {
    try {
      const sendingTo = process.env.USER_QUEUE;
      if (!sendingTo) {
        throw new Error("sendingTo env is not accessible, from admin service");
      }

      const correlationIdString = "toGetAllUsers";
      const correlationId = createCorrelationId(correlationIdString);
      const source = "get All Users";

      sendToService({
        sendingTo,
        correlationId,
        source,
        correlationIdIdentifier: correlationIdString,
      });

      const responseData: any = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Response timeout"));
        }, 10000);

        eventEmitter.once(correlationId, (data) => {
          clearTimeout(timeout);
          resolve(data);
        });
      });
      if (!responseData.status) {
        throw new AppError(
          "Failed to fetch users",
          StatusCode.INTERNAL_SERVER_ERROR
        );
      }

      return responseData.data;
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

  async getAllAdmins(): Promise<any> {
    try {
      const adminList = await this._adminRepository.findAll();

      const mappedAdmins = adminList.map((admin) => {
        const savedEntity = AdminMapper.toEntity(admin);
        return AdminMapper.toGetAllAdminsDto(savedEntity);
      });

      return mappedAdmins;
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(error, "Something went wrong while fetching admins");
    }
  }

  async changeUserStatus(props: ChangeUserStatusDTO): Promise<any> {
    try {
      const sendingTo = process.env.USER_QUEUE;
      if (!sendingTo) {
        throw new Error("sendingTo env is not accessible, from admin service");
      }

      const correlationIdString = "toChangeTheUserStatus";
      const correlationId = createCorrelationId(correlationIdString);
      const source = "Change the User Status";

      sendToService({
        sendingTo,
        correlationId,
        source,
        correlationIdIdentifier: correlationIdString,
        props,
      });

      const responseData: any = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Response timeout"));
        }, 10000);

        eventEmitter.once(correlationId, (data) => {
          clearTimeout(timeout);
          resolve(data);
        });
      });
      if (!responseData.status) {
        throw new AppError(
          "Failed to update user",
          StatusCode.INTERNAL_SERVER_ERROR
        );
      }

      return responseData.data;
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

  async changeAdminStatus({ adminId }: ChangeAdminStatusDTO): Promise<any> {
    try {
      if (!adminId) {
        throw new AppError("adminId is required", StatusCode.BAD_REQUEST);
      }

      const responseData = await this._adminRepository.changeStatus(adminId);
      if (!responseData) {
        throw new AppError(
          "failed to update admin",
          StatusCode.INTERNAL_SERVER_ERROR
        );
      }

      return responseData;
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(error, "Something went wrong while updating admin");
    }
  }

  async insertAdmin({
    email,
    name,
    password,
    role,
  }: InsertAdminDTO): Promise<any> {
    try {
      if (!email || !name || !password || !role) {
        throw new AppError(
          "email, name, password, role and status is required"
        );
      }

      const admin = await this._adminRepository.insertAdmin({
        email,
        name,
        password,
        role,
      });
      if (!admin) {
        throw new AppError(
          "Failed to insert admin",
          StatusCode.INTERNAL_SERVER_ERROR
        );
      }

      return admin;
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }
      handleServiceError(error, "Something went wrong while inserting admin");
    }
  }

  // To create a new access token with the existing refresh token
  async refreshToken({ token }: RefreshTokenDTO): Promise<any> {
    try {
      if (!token) {
        throw new AppError("token is required", StatusCode.BAD_REQUEST);
      }

      const decoded = jwtFunctions.verifyAdminRefreshToken(token);
      if (!decoded) {
        throw new AppError("token expired", StatusCode.UNAUTHORIZED);
      }

      const adminData = await this._adminRepository.findAdmin(decoded.email);
      if (!adminData) {
        throw new AppError("admin not found", StatusCode.NOT_FOUND);
      } else if (adminData.status !== "active") {
        throw new AppError("admin is blocked", StatusCode.FORBIDDEN);
      }

      const newAccessToken = jwtFunctions.generateAdminAccessToken({
        id: adminData._id.toString(),
        email: adminData.email,
        role: adminData.role,
      });
      if (!newAccessToken) {
        throw new AppError(
          "Faile to create access token",
          StatusCode.INTERNAL_SERVER_ERROR
        );
      }

      return newAccessToken;
    } catch (error: any) {
      if (error.name === "MongoNetworkError") {
        throw new AppError(
          "Database connection failed",
          StatusCode.SERVICE_UNAVAILABLE
        );
      }

      handleServiceError(
        error,
        "Something went wrong while creating new access token"
      );
    }
  }
}

// to access the User Data after the status change
export function userDataStatusChange(correlationId: string, params: any) {
  eventEmitter.emit(correlationId, params);
}
