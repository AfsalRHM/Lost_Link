import mongoose, { Schema } from "mongoose";

import IchatModel from "../interface/IchatModel";

const chatSchema = new Schema(
  {
    user_name: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    is_group_chat: {
      type: Boolean,
      default: false,
    },
    request_name: {
      type: String,
      required: true,
    },
    request_id: {
      type: String,
      required: true
    },
    request_status: {
      type: String,
      required: true
    },
    latest_message: {
      type: {
        sender: String,
        content: String,
        chat: String,
        createdAt: Date,
        updatedAt: Date,
      },
    },
    group_admin: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IchatModel>("Chat", chatSchema);
