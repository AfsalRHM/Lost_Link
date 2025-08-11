export interface AdminGetReportResponseDto {
  id: string;
  userId: string;
  userName: string;
  reason: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminGetReportSummaryResponseDto {
  id: string;
  userName: string;
  reason: string;
  createdAt: Date;
}
