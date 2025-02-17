import mongoose, { Schema } from "mongoose";

import ImessageModel from "../interface/ImessageModel";

const messageSchema = new Schema(
  {
    sender: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Chat"
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ImessageModel>("Message", messageSchema);
