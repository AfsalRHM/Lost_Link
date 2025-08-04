export interface userEntity {
  id: string;
  profilePic: string;
  fullName: string;
  userName: string;
  location: string;
  email: string;
  wallet: number;
  phone?: number | null;
  status: string;
  password: string;
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
  createdAt?: Date;
  updatedAt?: Date;
}
