import { Model } from "mongoose";

import BaseRepository from "./baseRepository";

import IadminModel from "../interface/IadminModel";
import { IadminRepository } from "../interface/IadminRepository";

export default class AdminRepository
  extends BaseRepository<IadminModel>
  implements IadminRepository
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

  async findSomeAdmins(): Promise<IadminModel[]> {
    return this.findSome({}, 0, 10);
  }

  async findAllAdmins(): Promise<IadminModel[]> {
    return this.findAll();
  }

  async findPaginatedAdmins(
    filter: object,
    skip: number,
    limit: number
  ): Promise<any> {
    return this.findPaginated(filter, skip, limit);
  }

  async changeAdminStatus(adminId: string): Promise<IadminModel | null> {
    try {
      const admin = await this.model.findById(adminId);
      if (!admin) {
        throw new Error("Admin not found");
      }

      const newStatus = admin.status === "active" ? "inactive" : "active";

      return await this.model.findByIdAndUpdate(
        adminId,
        { status: newStatus },
        { new: true }
      );
    } catch (error) {
      console.error("Error updating status:", error);
      return null;
    }
  }
}
