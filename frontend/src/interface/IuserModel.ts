export interface userDataType {
  _id: string;
  profile_pic: string;
  full_name: string;
  user_name: string;
  location: string;
  email: string;
  phone?: number | null;
  status: string;
  password: string;
  requests: string[];
  completed_requests: string[];
  points: number;
  current_tier: string;
  payment_history: string[];
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