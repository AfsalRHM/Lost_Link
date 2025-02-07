import { Document } from "mongoose";

export default interface ImessageModel extends Document {
  sender: string;
  content: string;
  chat: string;
  createdAt?: Date;
  updatedAt?: Date;
}
