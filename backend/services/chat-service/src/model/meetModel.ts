import mongoose, { Schema } from "mongoose";

import ImeetModel from "../interface/ImeetModel";

const meetSchema = new Schema(
  {
    meet_time: {
      type: String,
      required: true,
    },
    meet_date: {
      type: Date,
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
    request_id: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ImeetModel>("Meet", meetSchema);
