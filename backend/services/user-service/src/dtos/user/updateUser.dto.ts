export interface UpdateUserRequestDto {
  profile_pic: string;
  full_name: string;
  user_name: string;
  phone: number | null;
}

export interface UpdateUserResponseDto {
  id: string;
  fullName: string;
  userName: string;
  profilePic: string;
  email: string;
  phoneNumber: number | null;
}
