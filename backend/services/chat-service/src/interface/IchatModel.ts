import { Document } from "mongoose";

export default interface IchatModel extends Document {
  chat_name: string;
  is_group_chat: boolean;
  users: string[];
  latest_message: string;
  group_admin: string;
  createdAt?: Date;
  updatedAt?: Date;
}
