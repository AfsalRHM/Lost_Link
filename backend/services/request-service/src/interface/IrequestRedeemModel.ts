import mongoose, { Document } from "mongoose";

export default interface IrequestRedeemModel extends Document {
  _id: mongoose.Types.ObjectId;
  requestId: string;
  found_location: String;
  found_date: Date;
  damage_issues: String;
  mobile_number: String;
  bank_name: String;
  account_number: String;
  ifsc_code: String;
  account_holder_name: String;
  images: [String];
}
