import sendToService from "../rabbitmq/producer";

import { createCorrelationId } from "../utils/correlationId";

import adminRepository from "../repositories/adminRepository";
import IadminService, { adminProps } from "../interface/IadminService";

import eventEmitter from "../utils/eventEmitter";
import { Types } from "mongoose";
import { decodedType } from "../interface/IjwtTypes";
import jwtFunctions from "../utils/jwt";

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

      let responseData: {
        status: boolean;
        data: null | { accessToken: string; refreshToken: string };
      };

      if (!newAccessToken || !newRefreshToken) {
        responseData = {
          status: false,
          data: null,
        };
      } else {
        responseData = {
          status: true,
          data: {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          },
        };
      }

      if (responseData.status) {
        return {
          status: true,
          message: "Admin Verificaiton Successfull",
          data: adminData,
          tokenData: responseData.data,
        };
      } else {
        return {
          status: false,
          message: "Admin Verificaiton Failed",
          data: null,
        };
      }
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

  async changeAdminStatus(props: { adminId: string }): Promise<any> {
    try {
      if (!props.adminId) {
        throw new Error("Admin Id is empty...");
      }

      const responseData = await this._adminRepository.changeStatus(
        props.adminId
      );

      if (responseData) {
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

      const decoded = jwtFunctions.verifyAdminRefreshToken(token);

      console.log("Decode Refresh token is here", decoded);

      if (!decoded) {
        return { status: false, message: "Token expired" };
      }

      const adminData = await this._adminRepository.findAdmin(decoded.email);

      if (!adminData) {
        return { status: false, message: "Admin Not Found" };
      }

      console.log(adminData._id, "this is the admin Data");

      const newAccessToken = jwtFunctions.generateAdminAccessToken({
        id: adminData._id.toString(),
        email: adminData.email,
        role: adminData.role,
      });
      if (!newAccessToken) {
        return { status: false, message: "New Access Token not Generated" };
      }

      return { status: true, message: newAccessToken };
    } catch (error) {
      console.log(error);
    }
  }
}

// to access the User Data after the status change
export function userDataStatusChange(correlationId: string, params: any) {
  eventEmitter.emit(correlationId, params);
}
