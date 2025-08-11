export interface adminGetAllRedeemRequestsResponseDto {
  id: string;
  requestName: string;
  status: string;
  mobileNumber: string;
  createdAt: Date;
}

export interface getAllRedeemRequestResponseDto {
  id: string;
  requestId: string;
  userId: string;
  requestName: string;
  status: string;
  createdAt: Date;
}
