export default interface IrequestModel {
  id: string;
  userId: string;
  productName: string;
  productCategory: string;
  lastSeen: string;
  expirationValidity: string;
  missingWhile: string;
  missingPlace: string;
  travelMode: string;
  missingRoute: string[];
  productImages: string[];
  missingDate: Date;
  expirationDate: Date;
  additionalInfo: string;
  rewardAmount: number;
  status: string;
  likedUsers: string[];
  createdAt: Date;
  updatedAt: Date;
}
