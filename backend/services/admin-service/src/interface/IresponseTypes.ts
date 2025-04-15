export interface IserviceResponseType {
  status?: boolean;
  message?: string;
  data?: any;
  tokenData?: { accessToken: string; refreshToken: string } | null;
  error?: any;
}
