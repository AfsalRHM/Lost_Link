import { FilterQuery, Model } from "mongoose";

import BaseRepository from "./baseRepository";

import IrequestModel from "../interface/IrequestModel";
import IbaseRepository from "../interface/IbaseRepository";

export default class RequestRepository
  extends BaseRepository<IrequestModel>
  implements IbaseRepository<IrequestModel>
{
  constructor(model: Model<IrequestModel>) {
    super(model);
  }

  async insertRequest(
    requestData: Partial<IrequestModel>
  ): Promise<IrequestModel | null> {
    return this.insert(requestData);
  }

  async findAllRequests(): Promise<IrequestModel[] | null> {
    return this.findAll();
  }

  async findUser(userMail: string): Promise<IrequestModel | null> {
    return this.findOne({ email: userMail });
  }

  async updateUserByEmail(
    filter: FilterQuery<IrequestModel>,
    update: Partial<IrequestModel>
  ): Promise<IrequestModel | null> {
    return this.model.findOneAndUpdate(filter, update, { new: true });
  }

  async changeStatus(requestId: string): Promise<IrequestModel | null> {
    try {
      const request = await this.model.findById(requestId);
      if (!request) {
        throw new Error("User not found");
      }

      let currentStatus = request.status;

      if (request.toObject) {
        currentStatus = request.toObject().status;
      }

      const newStatus = currentStatus == "active" ? "inactive" : "active";

      const updatedRequest = await this.model.findByIdAndUpdate(
        requestId,
        {
          status: newStatus,
        },
        { new: true }
      );

      return updatedRequest;
    } catch (error) {
      console.error("Error updating status:", error);
      return null;
    }
  }

  async findUserRequests(userId: string): Promise<IrequestModel[] | null> {
    try {
      const userRequests = await this.model.find({ user_id: userId });
      return userRequests.length > 0 ? userRequests : null;
    } catch (error) {
      console.error("Error getting User Requests:", error);
      return null;
    }
  }

  async findByIdAndDislike({
    requestId,
    userId,
  }: {
    requestId: string;
    userId: string;
  }): Promise<IrequestModel | null> {
    try {
      const requestData = await this.model.findByIdAndUpdate(
        requestId,
        { $pull: { users_liked: userId } },
        { new: true }
      );
      return requestData;
    } catch (error) {
      console.error("Error disliking the Request:", error);
      return null;
    }
  }

  async findByIdAndLike({
    requestId,
    userId,
  }: {
    requestId: string;
    userId: string;
  }): Promise<IrequestModel | null> {
    try {
      const requestData = await this.model.findByIdAndUpdate(
        requestId,
        { $push: { users_liked: userId } },
        { new: true }
      );
      return requestData;
    } catch (error) {
      console.error("Error disliking the Request:", error);
      return null;
    }
  }
}
