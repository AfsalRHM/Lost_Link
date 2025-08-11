export interface userDataType {
  id: string;
  profilePic: string;
  fullName: string;
  userName: string;
  location: string;
  walletBalance: number;
  email: string;
  phoneNumber?: number | null;
  status: string;
  requests: string[];
  completedRequests: {
    requestId: string;
    completedAt: Date;
    pointsEarned: number;
  }[];
  points: number;
  paymentHistory: {
    date: Date;
    type: string;
    amount: number;
  }[];
  currentTier: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface formDataType {
  profilePic: string | undefined;
  fullName: string | undefined;
  userName: string | undefined;
  email: string | undefined;
  phone: number | null | undefined;
}
