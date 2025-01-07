import { DeleteResult, FilterQuery } from "mongoose";
import IbaseRepository from "../interface/IbaseRepository";
import IotpModel from "../interface/IotpModel";
import otpModel from "../models/otpModel";
import BaseRepository from "./baseRepository";

export default class OtpRepository
  extends BaseRepository<IotpModel>
  implements IbaseRepository<IotpModel>
{
  constructor() {
    super(otpModel);
  }

  async insertOTP(otpData: Partial<IotpModel>): Promise<IotpModel | null> {
    return this.insert(otpData);
  }

  async findOTP(userMail: string): Promise<IotpModel | null> {
    return this.findOne({ email: userMail });
  }

  async updateOTPByEmail(
    filter: FilterQuery<IotpModel>,
    update: Partial<IotpModel>
  ): Promise<IotpModel | null> {
    return this.model.findOneAndUpdate(filter, update, { new: true });
  }

  async deleteOTP(userMail: string): Promise<IotpModel | DeleteResult> {
    return this.deleteMany(userMail);
  }
}
