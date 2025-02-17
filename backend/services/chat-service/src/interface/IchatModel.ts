import { Document } from "mongoose";
import ImessageModel from "./ImessageModel";

export default interface IchatModel extends Document {
  chat_name: string;
  is_group_chat: boolean;
  users: string[];
  latest_message: ImessageModel;
  group_admin: string;
  createdAt?: Date;
  updatedAt?: Date;
}
