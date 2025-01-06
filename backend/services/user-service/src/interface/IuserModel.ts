import mongoose, { Document } from "mongoose";

export default interface IuserModel extends Document {
  _id: mongoose.Types.ObjectId;
  full_name: string;
  user_name: string;
  location: string;
  email: string;
  password: string;
  status: string;
}
