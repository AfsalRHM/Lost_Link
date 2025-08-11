export interface CreateRequestRequestDto {
  user_id: string;
  product_name: string;
  reward_amount: number;
  product_category: string;
  last_seen: string;
  missing_while: string;
  missing_place: string;
  mode_of_travel: string;
  missing_route: string[];
  missing_date: Date;
  expiration_validity: string;
  expiration_date: Date;
  product_images: string[];
  additional_information: string;
}
