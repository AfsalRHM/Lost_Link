import { DeleteResult, FilterQuery } from "mongoose";
import IotpModel from "./IotpModel";

export interface IotpRepository {
  insertOTP(otpData: Partial<IotpModel>): Promise<IotpModel | null>;
  findOTP(userMail: string): Promise<IotpModel | null>;
  updateOTPByEmail(
    filter: FilterQuery<IotpModel>,
    update: Partial<IotpModel>
  ): Promise<IotpModel | null>;
  deleteOTP(userMail: string): Promise<IotpModel | DeleteResult>;
}
