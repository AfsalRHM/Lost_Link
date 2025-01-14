import { Types } from "mongoose";

import IauthService, { UserDataType } from "../interface/IauthService";
import otpRepository from "../repositories/otpRepository";
import passwordUtils from "../utils/bcryptPassword";
import jwtFunctions from "../utils/jwt";

import sendMail from "../utils/sendMail";
import { getChannel } from "../config/communicationConfig";
import {
  clearCorrelationId,
  createCorrelationId,
} from "../utils/correlationId";
import eventEmitter from "../utils/eventEmitter";
import sendToService from "../rabbitmq/producer";

export default class authService implements IauthService {
  private _otpRepository: otpRepository;

  constructor() {
    this._otpRepository = new otpRepository();
  }

  // Function to check the user already exists or not
  async checkMail(recieverEmail: string): Promise<boolean> {
    try {
      const replyQueue = process.env.USER_QUEUE;
      const correlationId = createCorrelationId(recieverEmail);

      if (!replyQueue) {
        throw new Error("replyQueue is empty...!");
      }

      sendToService({
        sendingTo: replyQueue,
        correlationId: correlationId,
        source: "user mail duplication request",
        userMail: recieverEmail,
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

      if (userData.data) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error, "error on the checkMail/authService");
      return false;
    }
  }

  async resetPassword(userMail: string, newPassword: string): Promise<any> {
    const hashedPassword = await passwordUtils.hashPassword(newPassword);

    const replyQueue = process.env.USER_QUEUE;
    const correlationId = createCorrelationId(userMail);

    if (!replyQueue) {
      throw new Error("replyQueue is empty...!");
    }

    sendToService({
      sendingTo: replyQueue,
      correlationId: correlationId,
      source: "new password to save to user",
      userMail,
      newPassword: hashedPassword,
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

    if (userData.data) {
      return { status: true, data: userData.data, message: "Password changed" };
    } else {
      return { status: false, data: null, message: "Password not changed" };
    }
  }

  // Method to Send Mail to the User Mail
  async sendMail(recieverEmail: string, recieverName: string): Promise<any> {
    let otp: string;
    if (recieverName == "Reset Password") {
      const replyQueue = process.env.USER_QUEUE;
      const correlationId = createCorrelationId(recieverEmail);

      if (!replyQueue) {
        throw new Error("replyQueue is empty...!");
      }

      sendToService({
        sendingTo: replyQueue,
        correlationId: correlationId,
        source: "user name for mail request",
        userMail: recieverEmail,
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

      if (userData.data) {
        otp = await sendMail(recieverEmail, userData.user_name);
        const expire = new Date(Date.now() + 10 * 1000 * 1);
        await this._otpRepository.deleteMany(recieverEmail);
        const data = await this._otpRepository.insertOTP({
          email: recieverEmail,
          otp: otp,
          expires_at: expire,
        });
        return { status: true, data: data, message: "user found" };
      } else {
        return { status: false, data: null, message: "No user found" };
      }
    } else {
      otp = await sendMail(recieverEmail, recieverName);
      const expire = new Date(Date.now() + 10 * 1000 * 1);
      await this._otpRepository.deleteMany(recieverEmail);
      const data = await this._otpRepository.insertOTP({
        email: recieverEmail,
        otp: otp,
        expires_at: expire,
      });
    }
  }

  // Method to verfiy the user Entered OTP
  async verifyotp(userEmail: string, userEnteredOTP: string): Promise<boolean> {
    const data = await this._otpRepository.findOTP(userEmail);
    if (data?.otp == userEnteredOTP) {
      return true;
    } else {
      return false;
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
    const hashedPassword = await passwordUtils.hashPassword(userPassword);

    const data = {
      full_name: userFullName,
      user_name: userName,
      location: userLocation,
      email: userEmail,
      password: hashedPassword,
    };

    const replyQueue = process.env.USER_QUEUE;
    const correlationId = createCorrelationId(data.email);

    if (!replyQueue) {
      throw new Error("replyQueue is empty...!");
    }

    sendToService({
      sendingTo: replyQueue,
      correlationId: correlationId,
      source: "user data insert request",
      userData: data,
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

    if (userData) {
      clearCorrelationId(userData.email);
      return userData;
    } else {
      return { status: false, data: null, message: "Registeration Failed" };
    }
  }

  // Function to  verify the User Entries for login
  async loginVerify(userEmail: string, userPassword: string): Promise<any> {
    const replyQueue = process.env.USER_QUEUE;
    const correlationId = createCorrelationId(userEmail);

    if (!replyQueue) {
      throw new Error("replyQueue is empty...!");
    }

    sendToService({
      sendingTo: replyQueue,
      correlationId: correlationId,
      source: "user login request",
      userMail: userEmail,
    });

    const userData: UserDataType | null = await new Promise(
      (resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Response timeout"));
        }, 10000);

        eventEmitter.once(correlationId, (data) => {
          clearTimeout(timeout);
          resolve(data);
        });
      }
    );

    if (userData?.password) {
      const isMatch = await passwordUtils.comparePassword(
        userPassword,
        userData.password
      );

      const plainUserData = userData;
      const { password, ...rest } = plainUserData;

      if (isMatch) {
        if (userData.status == "inactive") {
          return {
            status: false,
            data: null,
            message: "Your Account has been Blocked",
          };
        } else {
          return { status: true, data: rest };
        }
      } else {
        return {
          status: false,
          data: null,
          message: "Invalid Credentials",
        };
      }
    } else {
      return {
        status: false,
        data: null,
        message: "Invalid Credentials",
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

  async googleLoginVerify(
    email: string
  ): Promise<{ status: boolean; data: UserDataType | null; message: string }> {
    if (email) {
      const replyQueue = process.env.USER_QUEUE;
      const correlationId = createCorrelationId(email);

      if (!replyQueue) {
        throw new Error("replyQueue is empty...!");
      }

      sendToService({
        sendingTo: replyQueue,
        correlationId: correlationId,
        source: "user login request",
        userMail: email,
      });

      const userData: UserDataType | null = await new Promise(
        (resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error("Response timeout"));
          }, 10000);

          eventEmitter.once(correlationId, (data) => {
            clearTimeout(timeout);
            resolve(data);
          });
        }
      );

      return {
        status: true,
        data: userData,
        message: "Email Verification Success",
      };
    } else {
      return {
        status: false,
        data: null,
        message: "Email not reached on the googleLoginVerify/authService",
      };
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
