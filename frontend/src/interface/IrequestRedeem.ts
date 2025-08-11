export default interface IredeemRequestModel {
  id: string;
  requestId: string;
  userId: string;
  requestName: string;
  rewardAmount: number;
  expirationValidity: string;
  itemCategory: string;
  foundLocation: string;
  foundDate: Date;
  damageIssues: string;
  mobileNumber: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountHolder: string;
  images: string[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
