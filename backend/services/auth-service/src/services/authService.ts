import { Types } from "mongoose";

import IauthService, { UserDataType } from "../interface/IauthService";
import otpRepository from "../repositories/otpRepository";
import passwordUtils from "../utils/bcryptPassword";
import jwtFunctions from "../utils/jwt";

import sendMail from "../utils/sendMail";
import {
  clearCorrelationId,
  createCorrelationId,
} from "../utils/correlationId";
import eventEmitter from "../utils/eventEmitter";
import sendToService from "../rabbitmq/producer";
import jwtPayload from "../interface/IjwtPayload";

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

      const props = {
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

    const props = {
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

    if (userData.data) {
      return { status: true, data: userData.data, message: "Password changed" };
    } else {
      return { status: false, data: null, message: "Password not changed" };
    }
  }

  // Method to Send Mail to the User Mail
  async sendMail(recieverEmail: string, recieverName: string): Promise<any> {
    let otp: string | null;
    if (recieverName == "Reset Password") {
      const replyQueue = process.env.USER_QUEUE;
      const correlationId = createCorrelationId(recieverEmail);

      if (!replyQueue) {
        throw new Error("replyQueue is empty...!");
      }

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

      if (userData.data) {
        otp = await sendMail(recieverEmail, userData.user_name);
        if (!otp) {
          return { status: false, data: null, message: "Otp Not Send" };
        }
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
        otp: otp!,
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

  async createJwtTokens(messageContent: any): Promise<any> {
    try {
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

      if (accessToken && refreshToken) {
        return { status: true, data: { accessToken, refreshToken } };
      } else {
        throw new Error(
          "Admin And Refresh Token not generated on createJwtTokens/authService"
        );
      }
    } catch (error) {
      console.log(
        "An Error has appeared here on createJwtTokens/authService",
        error
      );
      return {
        status: false,
        data: null,
      };
    }
  }

  async verifyAdminAccessToken(messageContent: any): Promise<any> {
    try {
      const decoded = jwtFunctions.verifyAdminAccessToken(
        messageContent.props.token
      );
      if (decoded) {
        return {
          status: true,
          message: "Access token verified",
          data: decoded,
        };
      } else {
        return {
          status: false,
          message: "Access token expired verified",
          data: null,
        };
      }
    } catch (error) {
      console.log("An Error has appeared here", error);
    }
  }

  async verifyAdminRefreshToken(messageContent: any): Promise<any> {
    try {
      const decoded = jwtFunctions.verifyAdminRefreshToken(
        messageContent.props.token
      );
      if (decoded) {
        return {
          status: true,
          message: "Admin Refresh token verified",
          data: decoded,
        };
      } else {
        return {
          status: false,
          message: "Admin Refresh token expired verified",
          data: null,
        };
      }
    } catch (error) {
      console.log("An Error has appeared here", error);
    }
  }

  async createAdminRefreshToken(messageContent: any): Promise<any> {
    try {
      console.log(
        "This is the messageContent on the createAdminRefreshToken",
        messageContent
      );
      const accessToken = jwtFunctions.generateAdminAccessToken({
        id: messageContent.props.adminId,
        email: messageContent.props.email,
        role: messageContent.props.role,
      });

      if (accessToken) {
        return { status: true, data: { accessToken } };
      } else {
        throw new Error(
          "Admin Token not generated on createAdminRefreshToken/authService"
        );
      }
    } catch (error) {
      console.log(
        "An Error has appeared here on createJwtTokens/authService",
        error
      );
      return {
        status: false,
        data: null,
      };
    }
  }

  async verifyUserAccessToken(messageContent: any): Promise<any> {
    try {
      const decoded = jwtFunctions.verifyAccessToken(
        messageContent.props.token
      );
      if (decoded) {
        return {
          status: true,
          message: "Access token verified",
          data: decoded,
        };
      } else {
        return {
          status: false,
          message: "Access token expired verified",
          data: null,
        };
      }
    } catch (error) {
      console.log("An Error has appeared here", error);
    }
  }

  // To create a new access token with the existing refresh token
  async refreshToken(
    token: string
  ): Promise<
    { status: boolean; data: string | null; message: string } | undefined
  > {
    try {
      if (!token) {
        console.log("No Token Provided");
        return {
          status: false,
          data: null,
          message: "UnAuthorized Access Detected",
        };
      }
      const decoded: jwtPayload | null = jwtFunctions.verifyRefreshToken(token);
      if (!decoded) {
        console.log("Token expired");
        return {
          status: false,
          data: null,
          message: "Session Expired! Please Login...",
        };
      }
      const newUserId: string = new Types.ObjectId(decoded.id).toString();

      const replyQueue = process.env.USER_QUEUE || "USER";
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

      const newUserData = userDataResponse.data._doc;

      if (newUserData.status !== "active") {
        return {
          status: false,
          data: null,
          message: "You are Blocked from this Site.",
        };
      }

      const newAccessToken: string = jwtFunctions.generateAccessToken({
        id: newUserData._id,
        email: newUserData.email,
        role: newUserData.role,
      });
      return {
        status: true,
        data: newAccessToken,
        message: "New Access Token Created",
      };
    } catch (error) {
      console.log(error);
    }
  }

  // To create a new admin access token with the existing admin refresh token
  async adminRefreshToken(
    token: string
  ): Promise<{ status: boolean; message: string } | undefined> {
    try {
      console.log("Reaching here on refreshTOken/authService");
      console.log(token, "this is the data");
      if (!token) {
        return { status: false, message: "No Token Provided" };
      }
      const decoded = jwtFunctions.verifyAdminRefreshToken(token);
      if (!decoded) {
        return { status: false, message: "Token expired" };
      }
      const newUserId = new Types.ObjectId(decoded.id).toString();
      const newAccessToken = jwtFunctions.generateAdminAccessToken({
        id: newUserId,
        email: decoded.email,
        role: decoded.role,
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

      const props = {
        userMail: email,
      };

      sendToService({
        sendingTo: replyQueue,
        correlationId: correlationId,
        source: "user login request",
        props,
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

// to access the userDetails from the queue after registration
export function getUserDataByUserId(correlationId: string, params: any) {
  eventEmitter.emit(correlationId, params);
}
