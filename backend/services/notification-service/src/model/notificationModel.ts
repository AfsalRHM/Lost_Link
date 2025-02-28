import mongoose, { Schema } from "mongoose";

import InotificationModel from "../interface/InotificationModel";

const notificationSchema = new Schema(
  {
    sender: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<InotificationModel>("Notification", notificationSchema);
