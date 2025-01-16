import { FilterQuery } from "mongoose";
import IbaseRepository from "../interface/IbaseRepository";
import BaseRepository from "./baseRepository";
import IrequestModel from "../interface/IrequestModel";
import requestModel from "../models/requestModel";

export default class RequestRepository
  extends BaseRepository<IrequestModel>
  implements IbaseRepository<IrequestModel>
{
  constructor() {
    super(requestModel);
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
}
