import mongoose, { Schema } from "mongoose";

import IreportModel from "../interface/IreportModel";

const reportSchema = new Schema(
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
    user_name: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IreportModel>("report", reportSchema);
