import { Document } from "mongoose";

export default interface IcommentModel extends Document {
  request_id: string;
  user_id: string;
  content: string;
  comment_likes: String[];
  createdAt?: Date;
  updatedAt?: Date;
}
