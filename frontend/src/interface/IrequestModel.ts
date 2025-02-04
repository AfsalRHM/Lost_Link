export default interface IrequestModel {
  _id: string;
  user_id: string;
  product_name: string;
  reward_amount: number;
  product_category: string;
  missing_place: string;
  last_seen: string;
  expiration_validity: string;
  mode_of_travel: string;
  missing_route: string[];
  product_images: string[];
  missing_date: Date;
  expiration_date: string;
  additional_information: string;
  status: string;
}
