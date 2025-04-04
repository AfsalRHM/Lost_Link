import { Document } from "mongoose";

export default interface IreportModel extends Document {
  request_id: string;
  user_id: string;
  user_name: string;
  reason: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}
