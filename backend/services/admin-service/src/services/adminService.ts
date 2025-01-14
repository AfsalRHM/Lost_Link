import sendToService from "../rabbitmq/producer";

import { createCorrelationId } from "../utils/correlationId";

import adminRepository from "../repositories/adminRepository";
import IadminService, { adminProps } from "../interface/IadminService";

import eventEmitter from "../utils/eventEmitter";
import jwtFunctions from "../utils/jwt";
import { Types } from "mongoose";

export default class adminService implements IadminService {
  private _adminRepository: adminRepository;

  constructor() {
    this._adminRepository = new adminRepository();
  }

  async adminLogin(loginDetails: {
    email: string;
    password: string;
  }): Promise<any> {
    try {
      const adminData = await this._adminRepository.findAdmin(
        loginDetails.email
      );

      if (!adminData || adminData.password !== loginDetails.password) {
        return { status: false, message: "Invalid Credentials" };
      }

      return {
        status: true,
        message: "Admin Verificaiton Successfull",
        data: adminData,
      };
    } catch (error) {
      return { status: false, message: "Error in adminLogin/adminService" };
    }
  }

  async getAllUsers(): Promise<any> {
    try {
      const correlationIdString = "toGetAllUsers";
      const correlationId = createCorrelationId(correlationIdString);
      const sendingTo = process.env.USER_QUEUE;
      const source = "get All Users";

      if (!sendingTo) {
        throw new Error("sendingTo is emplty...");
      }

      sendToService({ sendingTo, correlationId, source, correlationIdString });

      const responseData: any = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Response timeout"));
        }, 10000);

        eventEmitter.once(correlationId, (data) => {
          clearTimeout(timeout);
          resolve(data);
        });
      });

      if (responseData.status) {
        return responseData;
      } else {
        return {
          status: false,
          message: "responseData not reached on here from the mangingQueue 1",
        };
      }
    } catch (error) {
      return {
        status: false,
        message: "Error in getAllUsers/adminService",
        error: error,
      };
    }
  }

  async getAllAdmins(): Promise<any> {
    try {
      const adminData = await this._adminRepository.findAll();

      if (adminData) {
        return {
          status: true,
          data: adminData,
          message: "All admins Fetched Successfully",
        };
      } else {
        return {
          status: false,
          message: "adminData not reached on here from the mangingQueue 1",
        };
      }
    } catch (error) {
      return {
        status: false,
        message: "Error in getAllAdmins/adminService",
        error: error,
      };
    }
  }

  async changeUserStatus(props: { userId: string }): Promise<any> {
    try {
      const correlationIdString = "toChangeTheUserStatus";
      const correlationId = createCorrelationId(correlationIdString);
      const sendingTo = process.env.USER_QUEUE;
      const source = "Change the User Status";

      if (!sendingTo) {
        throw new Error("sendingTo is emplty...");
      }

      sendToService({
        sendingTo,
        correlationId,
        source,
        correlationIdString,
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

      if (responseData.status) {
        return responseData;
      } else {
        return {
          status: false,
          message: "responseData not reached on here from the mangingQueue 2",
        };
      }
    } catch (error) {
      return {
        status: false,
        message: "Error in getAllUsers/adminService",
        error: error,
      };
    }
  }

  async insertAdmin(props: adminProps): Promise<any> {
    try {
      const response = await this._adminRepository.insert(props);
      console.log(response);
      if (response) {
        return response;
      } else {
        return {
          status: false,
          message: "responseData not reached, in insertAdmin/adminService",
        };
      }
    } catch (error) {
      return {
        status: false,
        message: "Error in insertAdmin/adminService",
        error: error,
      };
    }
  }

  // To create a new access token with the existing refresh token
  async refreshToken(
    token: string
  ): Promise<{ status: boolean; message: string } | undefined> {
    try {
      if (!token) {
        return { status: false, message: "No Token Provided" };
      }
      const decoded = jwtFunctions.verifyRefreshToken(token);
      if (!decoded) {
        return { status: false, message: "Token expired" };
      }
      const newUserId = new Types.ObjectId(decoded.userId).toString();
      const newAccessToken = jwtFunctions.generateAccessToken({
        userId: newUserId,
      });
      return { status: true, message: newAccessToken };
    } catch (error) {
      console.log(error);
    }
  }
}

// to access the User List after the API call
export function userList(correlationId: string, params: any) {
  eventEmitter.emit(correlationId, params);
}

// to access the User Data after the status change
export function userDataStatusChange(correlationId: string, params: any) {
  eventEmitter.emit(correlationId, params);
}
