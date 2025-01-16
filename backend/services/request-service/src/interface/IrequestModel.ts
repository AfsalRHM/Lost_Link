import mongoose, { Document } from "mongoose";

export default interface IrequestModel extends Document {
  _id: mongoose.Types.ObjectId;
  user_id: string;
  product_name: string;
  reward_amount: number;
  product_category: string;
  missing_place: string;
  mode_of_travel: string;
  missing_route: string[];
  missing_date: Date;
  expiration_date: string;
  additional_information: Date;
  status: string;
}
