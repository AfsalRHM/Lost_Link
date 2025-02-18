import { Document } from "mongoose";
import ImessageModel from "./ImessageModel";

export default interface IchatModel extends Document {
  user_name: string;
  request_name: string;
  user_id: string;
  request_id: string;
  request_status: string;
  is_group_chat: boolean;
  latest_message: ImessageModel;
  group_admin: string;
  createdAt?: Date;
  updatedAt?: Date;
}
