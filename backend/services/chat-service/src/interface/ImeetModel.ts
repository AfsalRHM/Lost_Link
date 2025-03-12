import { Document } from "mongoose";

export default interface ImeetModel extends Document {
  meet_time: string;
  meet_date: Date;
  user_id: string;
  user_name: string;
  request_id: string;
  createdAt?: Date;
  updatedAt?: Date;
}
