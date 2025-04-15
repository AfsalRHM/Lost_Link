import { IserviceResponseType } from "./IresponseTypes";

export default interface IadminService {
  adminLogin(loginDetails: {
    email: string;
    password: string;
  }): Promise<IserviceResponseType>;
  getAllUsers(): Promise<IserviceResponseType>;
  getAllAdmins(): Promise<IserviceResponseType>;
  changeUserStatus(props: { userId: string }): Promise<IserviceResponseType>;
  insertAdmin(props: adminProps): Promise<IserviceResponseType>;
}

export interface adminProps {
  email: string;
  name: string;
  role: string;
  password: string;
  status: string;
}
