import { DeleteResult, FilterQuery } from "mongoose";
import BaseRepository from "./baseRepository";
import IbaseRepository from "../interface/IbaseRepository";
import adminModel from "../model/adminModel";
import IadminModel from "../interface/IadminModel";

export default class
  extends BaseRepository<IadminModel>
  implements IbaseRepository<IadminModel>
{
  constructor() {
    super(adminModel);
  }

  async findAdmin(adminMail: string): Promise<IadminModel | null> {
    return this.findOne({ email: adminMail });
  }
}
