import mongoose, { Schema } from "mongoose";

import IredeemRequestModel from "../interface/IredeemRequestModel";

const redeemRequestSchema = new Schema(
  {
    request_id: {
      type: mongoose.Types.ObjectId,
      ref: "Request",
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    found_location: {
      type: String,
      required: true,
    },
    found_date: {
      type: Date,
      required: true,
    },
    damage_issues: {
      type: String,
      required: true,
    },
    mobile_number: {
      type: String,
      required: true,
    },
    bank_name: {
      type: String,
      required: true,
    },
    account_number: {
      type: String,
      required: true,
    },
    ifsc_code: {
      type: String,
      required: true,
    },
    account_holder_name: {
      type: String,
    },
    images: {
      type: Array,
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IredeemRequestModel>(
  "Request_Redeem",
  redeemRequestSchema
);
