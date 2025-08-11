export interface GetRequestDetailsResponseDto {
  id: string;
  userId: string;
  productName: string;
  rewardAmount: number;
  productCategory: string;
  missingWhile: string;
  missingPlace: string;
  travelMode: string;
  missingRoute: string[];
  lastSeen: string;
  missingDate: Date;
  expirationDate: Date;
  expirationValidity: string;
  additionalInfo: string;
  status: string;
  productImages: string[];
  likedUsers: string[];
  createdAt: Date;
}
