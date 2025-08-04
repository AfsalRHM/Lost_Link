import { DeleteResult, FilterQuery, Model } from "mongoose";

import BaseRepository from "./baseRepository";

import IotpModel from "../interface/IotpModel";
import IbaseRepository from "../interface/IbaseRepository";

export default class OtpRepository
  extends BaseRepository<IotpModel>
  implements IbaseRepository<IotpModel>
{
  constructor(model: Model<IotpModel>) {
    super(model);
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
