import { FilterQuery } from "mongoose";
import IbaseRepository from "../interface/IbaseRepository";
import BaseRepository from "./baseRepository";
import IuserModel from "../interface/IuserModel";
import userModel from "../models/userModel";

export default class
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
}
