import mongoose, { Schema } from "mongoose";

import IchatModel from "../interface/IchatModel";
import ImessageModel from "../interface/ImessageModel";

const chatSchema = new Schema(
  {
    chat_name: {
      type: String,
      required: true,
      trim: true,
    },
    is_group_chat: {
      type: Boolean,
      default: false,
    },
    users: [
      {
        type: String,
      },
    ],
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
