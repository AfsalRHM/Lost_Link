import IrequestModel from "./IrequestModel";

export default interface requestRedeemType {
  _id: string;
  user_id: string;
  request_id: IrequestModel;
  found_location: String;
  found_date: Date;
  damage_issues: String;
  mobile_number: String;
  bank_name: String;
  account_number: String;
  ifsc_code: String;
  account_holder_name: String;
  images: [String];
  status: string;
}
