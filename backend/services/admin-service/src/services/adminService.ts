import { Types } from "mongoose";

import { getChannel, getConnection } from "../config/communicationConfig";

import {
  clearCorrelationId,
  createCorrelationId,
} from "../utils/correlationId";

import adminRepository from "../repositories/adminRepository";
import IadminService from "../interface/IadminService";

import eventEmitter from "../utils/eventEmitter";

interface adminProps {
  email: string;
  name: string;
  role: string;
  password: string;
  status: string;
}

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
      const channel = getChannel();
      const currentQueue = process.env.AUTH_QUEUE || "ADMIN";
      const replyQueue = process.env.USER_QUEUE || "USER";
      const correlationId = createCorrelationId("toGetAllUsers");

      console.log(correlationId, "og correlation id");

      // Sending the userData to User Service for loginVerify
      channel.sendToQueue("USER", Buffer.from(JSON.stringify({})), {
        replyTo: currentQueue,
        correlationId: correlationId,
        headers: {
          source: "get All Users",
          correlationIdString: "toGetAllUsers",
        },
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
      const channel = getChannel();
      const currentQueue = process.env.AUTH_QUEUE || "ADMIN";
      const replyQueue = process.env.USER_QUEUE || "USER";
      const correlationId = createCorrelationId("toChangeTheUserStatus");

      const userId = props.userId;

      // Sending the userData to User Service for loginVerify
      channel.sendToQueue(
        "USER",
        Buffer.from(JSON.stringify({ userId: userId })),
        {
          replyTo: currentQueue,
          correlationId: correlationId,
          headers: {
            source: "Change the User Status",
            correlationIdString: "toChangeTheUserStatus",
          },
        }
      );

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
}

// to access the User List after the API call
export function userList(correlationId: string, params: any) {
  console.log("function userList is working", correlationId, params);
  eventEmitter.emit(correlationId, params);
}

// to access the User Data after the status change
export function userDataStatusChange(correlationId: string, params: any) {
  console.log("function userList is working", correlationId, params);
  eventEmitter.emit(correlationId, params);
}
