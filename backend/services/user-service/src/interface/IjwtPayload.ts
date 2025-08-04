export default interface jwtPayload {
  id: string;
  email: string;
  role: string;
}

export interface IAccessTokenJwtReturn {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface IRefreshTokenJwtReturn {
  id: string;
}