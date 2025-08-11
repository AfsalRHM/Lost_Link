import mongoose, { Document } from "mongoose";

export default interface IredeemRequestModel extends Document {
  _id: mongoose.Types.ObjectId;
  user_id: string;
  request_id: string;
  request_name: string;
  reward_amount: number;
  request_expiration_validity: string;
  request_item_category: string;
  found_location: string;
  found_date: Date;
  damage_issues: string;
  mobile_number: string;
  bank_name: string;
  account_number: string;
  ifsc_code: string;
  account_holder_name: string;
  images: string[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
