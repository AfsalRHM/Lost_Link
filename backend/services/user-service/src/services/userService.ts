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
      return { status: false, data: userData, message: "Registeration Failed", email: recieverEmail };;
    } else {
      return { status: false, data: null, message: "Registeration Failed", email: recieverEmail };;
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
    };
    const userData = await this._userRepository.insertUser(data);
    if (userData) {
      const plainUserData = userData?.toObject();
      const { password, ...rest } = plainUserData;
      return rest;
    } else {
      return { status: false, data: null, message: "Registeration Failed", email: userEmail };
    }
  }

  async loginUser(userMail: string): Promise<any> {
    const userData = await this._userRepository.findUser(userMail);
    if (userData) {
      return userData;
    } else {
      return { status: false, data: null, message: "Login Failed", email: userMail };;
    }
  }
  
}
