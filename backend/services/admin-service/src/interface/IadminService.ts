export default interface IadminService {
  adminLogin(loginDetails: { email: string; password: string }): Promise<any>;
  getAllUsers(): Promise<any>;
  getAllAdmins(): Promise<any>;
  changeUserStatus(props: { userId: string }): Promise<any>;
  insertAdmin(props: adminProps): Promise<any>;
}

export interface adminProps {
  email: string;
  name: string;
  role: string;
  password: string;
  status: string;
}
