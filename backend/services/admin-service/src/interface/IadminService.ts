import { AdminLoginDTO } from "../dtos/AdminLoginDTO";
import { ChangeAdminStatusDTO } from "../dtos/ChangeAdminStatusDTO";
import { ChangeUserStatusDTO } from "../dtos/ChangeUserStatusDTO";
import { InsertAdminDTO } from "../dtos/InsertAdminDTO";
import { RefreshTokenDTO } from "../dtos/RefreshTokenDTO";
import { IserviceResponseType } from "./IresponseTypes";

export default interface IadminService {
  adminLogin(loginDetails: AdminLoginDTO): Promise<IserviceResponseType>;
  getAllUsers(): Promise<IserviceResponseType>;
  getAllAdmins(): Promise<IserviceResponseType>;
  changeUserStatus(props: ChangeUserStatusDTO): Promise<IserviceResponseType>;
  changeAdminStatus(props: ChangeAdminStatusDTO): Promise<IserviceResponseType>;
  insertAdmin(props: InsertAdminDTO): Promise<IserviceResponseType>;
  refreshToken(props: RefreshTokenDTO): Promise<IserviceResponseType>;
}
