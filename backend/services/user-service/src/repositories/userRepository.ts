import { FilterQuery } from "mongoose";
import IbaseRepository from "../interface/IbaseRepository";
import BaseRepository from "./baseRepository";
import IuserModel from "../interface/IuserModel";
import userModel from "../models/userModel";
import { getTierByPoints } from "../utils/tier";

export default class UserRepository
  extends BaseRepository<IuserModel>
  implements IbaseRepository<IuserModel>
{
  constructor() {
    super(userModel);
  }

  async insertUser(userData: Partial<IuserModel>): Promise<IuserModel | null> {
    return this.insert(userData);
  }

  async findUser(userMail: string): Promise<IuserModel | null> {
    return this.findOne({ email: userMail });
  }

  async updateUserByEmail(
    filter: FilterQuery<IuserModel>,
    update: Partial<IuserModel>
  ): Promise<IuserModel | null> {
    return this.model.findOneAndUpdate(filter, update, { new: true });
  }

  async changeStatus(userId: string): Promise<IuserModel | null> {
    try {
      const user = await this.model.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      const newStatus = user.status === "active" ? "inactive" : "active";

      const updatedUser = await this.model.findByIdAndUpdate(
        userId,
        { status: newStatus },
        { new: true }
      );

      return updatedUser;
    } catch (error) {
      console.error("Error updating status:", error);
      return null;
    }
  }

  async findByIdAndAddRequestId(
    userId: string,
    requestId: string
  ): Promise<IuserModel | null> {
    try {
      const updatedUser = await this.model.findByIdAndUpdate(
        userId,
        { $push: { requests: requestId } },
        { new: true }
      );

      console.log(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error("Error adding request ID:", error);
      return null;
    }
  }

  async findByIdAndAddCompletedRequestIdAndPoints(
    userId: string,
    requestId: string,
    points: number
  ): Promise<IuserModel | null> {
    try {
      const updatedUser = await this.model.findByIdAndUpdate(
        userId,
        {
          $push: {
            completed_requests: {
              request_id: requestId,
              points_earned: points,
            },
          },
          $inc: {
            points: points,
          },
        },
        { new: true }
      );

      if (!updatedUser) {
        console.log("User not updated form the userRepository");
        return null;
      }

      return updatedUser;
    } catch (error) {
      console.error("Error adding request ID:", error);
      return null;
    }
  }
}
