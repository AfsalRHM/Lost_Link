import mongoose, { Schema } from "mongoose";

import IotpModel from "../interface/IotpModel";

const otpSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expires_at: {
      type: Date,
      expires: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IotpModel>("Otp", otpSchema);
