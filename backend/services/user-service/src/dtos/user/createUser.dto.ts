export interface CreateUserRequestDTO {
  full_name: string;
  user_name: string;
  location: string;
  email: string;
  password: string;
}

export interface CreateUserResponseDto {
  id: string;
  fullName: string;
  userName: string;
  email: string;
  location: string;
}
