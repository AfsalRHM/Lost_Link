import { Types } from "mongoose";

interface UserDataType {
  email: string;
  user_name: string;
  full_name: string;
  location: string;
  password?: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

import { IauthService } from "../interface/IauthService";
import otpRepository from "../repositories/otpRepository";
import userRepository from "../repositories/userRepository";
import passwordUtils from "../utils/bcryptPassword";
import jwtFunctions from "../utils/jwt";

import sendMail from "../utils/sendMail";
import { getChannel, getConnection } from "../config/communicationConfig";
import {
  clearCorrelationId,
  createCorrelationId,
} from "../utils/correlationId";
import eventEmitter from "../utils/eventEmitter";

export default class authService implements IauthService {
  private _otpRepository: otpRepository;
  private _userRepository: userRepository;

  constructor() {
    this._otpRepository = new otpRepository();
    this._userRepository = new userRepository();
  }

  // Function to check the user already exists or not
  async checkMail(recieverEmail: string): Promise<boolean> {
    // const userData = await this._userRepository.findUser(recieverEmail);
    // Sending the userData to User Service
    const channel = getChannel();
    const currentQueue = process.env.AUTH_QUEUE || "Default queue";
    const replyQueue = process.env.USER_QUEUE || "Deafult Queue";
    const correlationId = createCorrelationId(recieverEmail);

    channel.sendToQueue(
      replyQueue,
      Buffer.from(
        JSON.stringify({
          userMail: recieverEmail,
        })
      ),
      {
        replyTo: currentQueue,
        correlationId: correlationId,
        headers: { source: "user mail duplication request" },
      }
    );

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
  }

  async resetPassword(userMail: string, newPassword: string): Promise<any> {
    const hashedPassword = await passwordUtils.hashPassword(newPassword);

    const channel = getChannel();
    const currentQueue = process.env.AUTH_QUEUE || "Default queue";
    const replyQueue = process.env.USER_QUEUE || "Deafult Queue";
    const correlationId = createCorrelationId(userMail);

    const message = JSON.stringify({
      userMail: userMail,
      newPassword: hashedPassword,
    });

    // Sending the userData to User Service
    channel.sendToQueue(replyQueue, Buffer.from(message), {
      replyTo: currentQueue,
      correlationId: correlationId,
      headers: { source: "new password to save to user" },
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
      const channel = getChannel();
      const currentQueue = process.env.AUTH_QUEUE || "Default queue";
      const replyQueue = process.env.USER_QUEUE || "Deafult Queue";
      const correlationId = createCorrelationId(recieverEmail);

      // Sending the userData to User Service
      channel.sendToQueue(
        replyQueue,
        Buffer.from(
          JSON.stringify({
            userMail: recieverEmail,
          })
        ),
        {
          replyTo: currentQueue,
          correlationId: correlationId,
          headers: { source: "user name for mail request" },
        }
      );

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

    const channel = getChannel();
    const currentQueue = process.env.AUTH_QUEUE || "Default queue";
    const replyQueue = process.env.USER_QUEUE || "Deafult Queue";
    const correlationId = createCorrelationId(data.email);

    // Sending the userData to User Service
    channel.sendToQueue(
      replyQueue,
      Buffer.from(
        JSON.stringify({
          userData: data,
        })
      ),
      {
        replyTo: currentQueue,
        correlationId: correlationId,
        headers: { source: "user data insert request" },
      }
    );

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
    const channel = getChannel();
    const currentQueue = process.env.AUTH_QUEUE || "Default queue";
    const replyQueue = process.env.USER_QUEUE || "Deafult Queue";
    const correlationId = createCorrelationId(userEmail);

    // Sending the userData to User Service for loginVerify
    channel.sendToQueue(
      replyQueue,
      Buffer.from(
        JSON.stringify({
          userMail: userEmail,
        })
      ),
      {
        replyTo: currentQueue,
        correlationId: correlationId,
        headers: { source: "user login request" },
      }
    );

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
        return { status: true, data: rest };
      } else {
        return {
          status: false,
          data: null,
          message: "Invalid Credentials this worked ",
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
