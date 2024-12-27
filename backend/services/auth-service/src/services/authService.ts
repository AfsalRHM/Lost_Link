import { Types } from "mongoose";

interface UserDataType {
  email: string;
  user_name: string;
  full_name: string;
  location: string;
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

  async checkMail(recieverEmail: string): Promise<boolean> {
    const userData = await this._userRepository.findUser(recieverEmail);
    if (userData) {
      return true;
    } else {
      return false;
    }
  }

  // Method to Send Mail to the User Mail
  async sendMail(recieverEmail: string, recieverName: string): Promise<void> {
    const otp: string = await sendMail(recieverEmail, recieverName);
    const expire = new Date(Date.now() + 10 * 1000 * 1);
    await this._otpRepository.deleteMany(recieverEmail);
    const data = await this._otpRepository.insertOTP({
      email: recieverEmail,
      otp: otp,
      expires_at: expire,
    });
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
      console.log(userData, "DKjflsjdfklsjdflksdjlfsjl");
      return userData;
    } else {
      return { status: false, data: null, message: "Registeration Failed" };
    }
  }

  async loginVerify(userEmail: string, userPassword: string): Promise<any> {
    const userData = await this._userRepository.findUser(userEmail);

    if (userData) {
      const isMatch = await passwordUtils.comparePassword(
        userPassword,
        userData.password
      );

      const plainUserData = userData.toObject();
      const { password, ...rest } = plainUserData;

      if (isMatch) {
        return { status: true, data: rest };
      } else {
        return { status: false, data: null, message: "Invalid Credentials" };
      }
    } else {
      return { status: false, data: null, message: "Invalid Credentials" };
    }
  }

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

export function userDetails(correlationId: string, params: any) {
  eventEmitter.emit(correlationId, params);
}
