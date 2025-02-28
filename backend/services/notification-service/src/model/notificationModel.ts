import mongoose, { Schema } from "mongoose";

import InotificationModel from "../interface/InotificationModel";

const notificationSchema = new Schema(
  {
    sender: {
      type: String,
      required: true,
    },
    request_id: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true
    },
    chat_id: {
      type: String,
      required: true,
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<InotificationModel>(
  "Notification",
  notificationSchema
);
