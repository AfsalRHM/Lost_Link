import mongoose, { Schema } from "mongoose";

import IuserModel from "../interface/IuserModel";

const userSchema = new Schema(
  {
    profile_pic: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    full_name: {
      type: String,
      required: true,
    },
    user_name: {
      type: String,
      required: true,
      unique: true,
    },
    location: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    wallet: {
      type: Number,
      default: 0,
    },
    phone: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    requests: {
      type: [String],
      default: [],
    },
    completed_requests: {
      type: [
        {
          request_id: { type: String, required: true },
          completed_at: { type: Date, default: Date.now() },
          points_earned: { type: Number, required: true },
        },
      ],
      default: [],
    },
    points: {
      type: Number,
      default: 0,
    },
    payment_history: {
      type: [
        {
          type: { type: String, required: true },
          date: { type: Date, default: Date.now() },
          amount: { type: Number, required: true },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IuserModel>("User", userSchema);
