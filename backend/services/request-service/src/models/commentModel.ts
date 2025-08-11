import mongoose, { Schema } from "mongoose";

import IcommentModel from "../interface/IcommentModel";

const commentSchema = new Schema(
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
    user_info: {
      user_name: { type: String, required: true },
      profile_pic: { type: String, required: true },
    },
    content: {
      type: String,
      required: true,
    },
    comment_likes: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IcommentModel>("comment", commentSchema);
