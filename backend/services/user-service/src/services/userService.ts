import IuserModel from "../interface/IuserModel";
import IuserService, { updateFormDataType } from "../interface/IuserService";
import userRepository from "../repositories/userRepository";

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
      return {
        status: true,
        data: userData,
        message: "Login Successfull",
      };
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

  async getProfile({ userId }: { userId: string | undefined }): Promise<any> {
    try {
      if (!userId) {
        return {
          status: false,
          message: "User Id not reached on the getProfile/userService",
          data: null,
        };
      }
      const userData: IuserModel | null = await this._userRepository.findOne({
        _id: userId,
      });
      if (userData) {
        return {
          status: true,
          message: "User Data Is Available",
          data: userData,
        };
      } else {
        return {
          status: false,
          message: "User not exist with the provided user id",
          data: null,
        };
      }
    } catch (error) {
      console.log(error, "error on the getAllUsers/userService");
    }
  }

  async updateUser({
    updateFormData,
    userId,
  }: {
    updateFormData: updateFormDataType;
    userId: string;
  }): Promise<any> {
    try {
      if (!updateFormData) {
        return {
          status: false,
          message: "User Id not reached on the getProfile/userService",
          data: null,
        };
      }
      const userUpdateData = {
        profile_pic: updateFormData.profilePic,
        full_name: updateFormData.fullName,
        user_name: updateFormData.userName,
        phone: updateFormData.phone,
      };
      const userData: IuserModel | null =
        await this._userRepository.findByIdAndUpdate(userId, userUpdateData);
      if (userData) {
        return {
          status: true,
          message: "User Data Is Updated",
          data: userData,
        };
      } else {
        return {
          status: false,
          message: "User not exist with the provided user id",
          data: null,
        };
      }
    } catch (error) {
      console.log(error, "error on the getAllUsers/userService");
    }
  }

  async getUserDataById({ userId }: { userId: string }): Promise<any> {
    try {
      const userData = await this._userRepository.findOne({ _id: userId });
      if (userData) {
        const { password, ...newUserData } = userData;
        return {
          status: true,
          data: newUserData,
          message: "User Data Available",
        };
      } else {
        return {
          status: false,
          data: null,
          message: "User Un Available",
        };
      }
    } catch (error) {
      console.log(error, "error on the getUserDataById/userService");
    }
  }

  // To get all the users data for the comments live load
  async getUsersDataById({ userIds }: { userIds: string[] }): Promise<any> {
    try {
      let userDatas: any = [];
      for (let userId of userIds) {
        const userData = await this._userRepository.findOne({ _id: userId });
        const newUserData = userData
          ? (({ password, ...rest }) => rest)(userData.toObject())
          : null;
        userDatas.push(newUserData);
      }
      return userDatas;
    } catch (error) {
      console.log(error, "error on the getUsersDataById/userService");
    }
  }

  async addRequestId({
    requestId,
    userId,
  }: {
    requestId: string;
    userId: string;
  }): Promise<void> {
    try {
      const userData: IuserModel | null =
        await this._userRepository.findByIdAndAddRequestId(userId, requestId);
    } catch (error) {
      console.log(error, "error on the getAllUsers/userService");
    }
  }

  // Add the Completed Request Details to the User Data
  async addCompletedRequestDetails({
    requestId,
    userId,
    points,
    rewardAmount,
  }: {
    requestId: string;
    userId: string;
    points: number;
    rewardAmount: number;
  }): Promise<void> {
    try {
      console.log(
        requestId,
        userId,
        points,
        "This is from the addCompletedRequestDetails/userService"
      );
      const userData: IuserModel | null =
        await this._userRepository.findByIdAndAddCompletedRequestIdAndPoints(
          userId,
          requestId,
          points,
          rewardAmount
        );
    } catch (error) {
      console.log(error, "error on the addCompletedRequestDetails/userService");
    }
  }

  /****************************           Admin Side             **************************************/
  async getAllUsers(): Promise<any> {
    try {
      const userList = await this._userRepository.findAll();
      if (userList) {
        return {
          status: true,
          data: userList,
          message: "All Users Fetched Successfully",
        };
      } else {
        return {
          status: true,
          data: null,
          message: "Failed to Fetch All Users ",
        };
      }
    } catch (error) {
      console.log(error, "error on the getAllUsers/userService");
    }
  }

  // To get the user details to the admin side
  async getUserData({ userId }: { userId: string }): Promise<any> {
    try {
      const userData = await this._userRepository.findOne({ _id: userId });
      if (userData) {
        return {
          status: true,
          data: userData,
          message: "User Data Fetched Successfully",
        };
      } else {
        return {
          status: true,
          data: null,
          message: "Failed to Fetch User Data",
        };
      }
    } catch (error) {
      console.log(error, "error on the getUserData/userService");
      return {
        status: false,
        data: null,
        message: "Failed to get the User Data",
      };
    }
  }

  async changeUserStatus(props: { userId: string }): Promise<any> {
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
