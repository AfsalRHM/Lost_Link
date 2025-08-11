import { CompletedRequestDto } from "../shared/completeRequest.dto";
import { PaymentHistoryDto } from "../shared/paymentHistory.dto";

export interface AdminGetUserResponseDto {
  id: string;
  email: string;
  userName: string;
  fullName: string;
  profilePic: string;
  status: string;
  phoneNumber: number | null;
  location: string;
  points: number;
  requests: string[];
  walletBalance: number;
  currentTier: string;
  completedRequests: CompletedRequestDto[];
  paymentHistory: PaymentHistoryDto[];
  createdAt: Date;
  updatedAt: Date;
}
