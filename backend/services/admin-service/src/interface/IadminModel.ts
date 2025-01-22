import mongoose, { Document } from "mongoose";

export default interface IadminModel extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  name: string;
  role: string;
  status: string;
  password: string;
}
