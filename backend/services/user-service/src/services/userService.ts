import { Types } from "mongoose";

// import otpRepository from "../repositories/otpRepository";
import IuserService from "../interface/IuserService";
import userRepository from "../repositories/userRepository";
// import passwordUtils from "../utils/bcryptPassword";
// import jwtFunctions from "../utils/jwt";

// import sendMail from "../utils/sendMail";

export default class userService implements IuserService {
  private _userRepository: userRepository;

  constructor() {
    this._userRepository = new userRepository();
  }

  async checkMail(recieverEmail: string): Promise<any> {
    const userData = await this._userRepository.findUser(recieverEmail);
    if (userData) {
      return {
        status: true,
        data: userData,
        message: "Registration successfull",
        email: recieverEmail,
      };
    } else {
      return {
        status: false,
        data: null,
        message: "Registeration Failed",
        email: recieverEmail,
      };
    }
  }

  async insertuser(
    userFullName: string,
    userName: string,
    userLocation: string,
    userEmail: string,
    hashedPassword: string
  ): Promise<any> {
    const data = {
      full_name: userFullName,
      user_name: userName,
      location: userLocation,
      email: userEmail,
      password: hashedPassword,
      status: "active",
    };
    const userData = await this._userRepository.insertUser(data);
    if (userData) {
      const plainUserData = userData?.toObject();
      const { password, ...rest } = plainUserData;
      return rest;
    } else {
      return {
        status: false,
        data: null,
        message: "Registeration Failed",
        email: userEmail,
      };
    }
  }

  async loginUser(userMail: string): Promise<any> {
    const userData = await this._userRepository.findUser(userMail);
    if (userData) {
      return userData;
    } else {
      return {
        status: false,
        data: null,
        message: "Login Failed",
        email: userMail,
      };
    }
  }

  async updatePassword(userMail: string, newPassword: string): Promise<any> {
    const userData = await this._userRepository.updateUserByEmail(
      { email: userMail },
      { password: newPassword }
    );
    if (userData) {
      return {
        status: true,
        data: userData,
        message: "Password Changed Successfully",
        email: userMail,
      };
    } else {
      return {
        status: false,
        data: null,
        message: "Error in the user Service while chaging Password",
        email: userMail,
      };
    }
  }

  async getAllUsers(): Promise<any> {
    try {
      const userList = await this._userRepository.findAll();
      if (userList) {
        return {
          status: true,
          data: userList,
          message: "get All Users",
        };
      } else {
        return {
          status: false,
          data: null,
          message: "get All Users",
        };
      }
    } catch (error) {
      console.log(error, "error on the getAllUsers/userService");
    }
  }

  async changeUserStatus(props: {userId: string}): Promise<any> {
    try {
      const userData = await this._userRepository.changeStatus(props.userId);
      if (userData) {
        return {
          status: true,
          data: userData,
          message: "Status Changed",
        };
      } else {
        return {
          status: false,
          data: null,
          message: "Status didin't changed",
        };
      }
    } catch (error) {
      console.log(error, "error on the getAllUsers/userService");
    }
  }
  

}
