import { Model } from "mongoose";

import BaseRepository from "./baseRepository";

import IbaseRepository from "../interface/IbaseRepository";
import IadminModel from "../interface/IadminModel";

export default class AdminRepository
  extends BaseRepository<IadminModel>
  implements IbaseRepository<IadminModel>
{
  constructor(model: Model<IadminModel>) {
    super(model);
  }

  async insertAdmin(data: Partial<IadminModel>): Promise<IadminModel> {
    return this.insert(data);
  }

  async findAdmin(adminMail: string): Promise<IadminModel | null> {
    return this.findOne({ email: adminMail });
  }

  async findAll(): Promise<IadminModel[] | []> {
    return this.findAllAdmins();
  }

  async changeStatus(adminId: string): Promise<IadminModel | null> {
    try {
      const admin = await this.model.findById(adminId);
      if (!admin) {
        throw new Error("Admin not found");
      }

      const newStatus = admin.status === "active" ? "inactive" : "active";

      const updatedUser = await this.model.findByIdAndUpdate(
        adminId,
        { status: newStatus },
        { new: true }
      );

      return updatedUser;
    } catch (error) {
      console.error("Error updating status 1:", error);
      return null;
    }
  }
}
