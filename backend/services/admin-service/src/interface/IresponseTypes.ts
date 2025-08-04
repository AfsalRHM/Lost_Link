export interface IserviceResponseType {
  status?: boolean;
  message?: string;
  data?: any;
  accessToken: string;
  refreshToken: string;
  error?: any;
}
