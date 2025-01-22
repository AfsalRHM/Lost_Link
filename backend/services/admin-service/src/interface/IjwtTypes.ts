export interface jwtPayload {
  id: string;
  email: string;
  role: string;
}

export interface decodedType {
  status: boolean;
  message: string;
  data: any;
}
