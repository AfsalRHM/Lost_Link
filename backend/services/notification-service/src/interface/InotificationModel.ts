import { Document } from "mongoose";

export default interface InotificationModel extends Document {
  user_name: string;
  request_name: string;
  user_id: string;
  request_id: string;
  request_status: string;
  is_group_chat: boolean;
  group_admin: string;
  createdAt?: Date;
  updatedAt?: Date;
}
