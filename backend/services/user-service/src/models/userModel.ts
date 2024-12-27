import mongoose, { Schema } from "mongoose";

import IuserModel from "../interface/IuserModel";

const userSchema = new Schema(
  {
    full_name: {
      type: String,
      required: true,
    },
    user_name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IuserModel>("User", userSchema);
