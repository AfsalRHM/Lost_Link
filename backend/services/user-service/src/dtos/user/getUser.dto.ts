import { CompletedRequestDto } from "../shared/completeRequest.dto";
import { PaymentHistoryDto } from "../shared/paymentHistory.dto";

export interface GetUserResponseDTO {
  id: string;
  email: string;
  userName: string;
  fullName: string;
  profilePic: string;
  phoneNumber: number | null;
  points: number;
  requests: string[];
  walletBalance: number;
  currentTier: string;
  completedRequests: CompletedRequestDto[];
  paymentHistory: PaymentHistoryDto[];
}
