import { Document } from "mongoose";

export default interface IuserModel extends Document {
  profile_pic: string;
  full_name: string;
  user_name: string;
  location: string;
  email: string;
  phone?: number | null;
  status: string;
  password: string;
  requests: string[];
  completed_requests: {
    request_id: string;
    completed_at: Date;
    points_earned: number;
  }[];
  points: number;
  payment_history: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
