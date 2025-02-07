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
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ImessageModel>("Message", messageSchema);
