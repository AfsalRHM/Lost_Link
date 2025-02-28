import { Document } from "mongoose";

export default interface InotificationModel extends Document {
  _id: string;
  sender: string;
  request_id: string;
  chat_id: string;
  user_id: string;
  seen: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
