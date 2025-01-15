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

  async insertUser(
    userData: Partial<IrequestModel>
  ): Promise<IrequestModel | null> {
    return this.insert(userData);
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

  //   async changeStatus(userId: string): Promise<IrequestModel | null> {
  //     try {
  //       const user = await this.model.findById(userId);
  //       if (!user) {
  //         throw new Error("User not found");
  //       }

  //       const newStatus = user.status === "active" ? "inactive" : "active";

  //       const updatedUser = await this.model.findByIdAndUpdate(
  //         userId,
  //         { status: newStatus },
  //         { new: true }
  //       );

  //       return updatedUser;
  //     } catch (error) {
  //       console.error("Error updating status:", error);
  //       return null;
  //     }
  //   }
}
