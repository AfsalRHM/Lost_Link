import mongoose, { Document } from "mongoose";

export default interface IotpModel extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  otp: string;
  expires_at: Date;
}
