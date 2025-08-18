import { AdminLoginDTO } from "../dtos/AdminLoginDTO";
import { ChangeAdminStatusDTO } from "../dtos/ChangeAdminStatusDTO";
import { ChangeUserStatusDTO } from "../dtos/ChangeUserStatusDTO";
import { GetAllAdminResponseDto } from "../dtos/getAllAdmins.dto";
import { InsertAdminDTO } from "../dtos/InsertAdminDTO";
import { RefreshTokenDTO } from "../dtos/RefreshTokenDTO";
import { IserviceResponseType } from "./IresponseTypes";

export default interface IadminService {
  adminLogin(loginDetails: AdminLoginDTO): Promise<IserviceResponseType>;
  getAllUsers(): Promise<IserviceResponseType>;
  getAdmins({search, limit, page}: {search: string; limit: number; page: number;}): Promise<GetAllAdminResponseDto[]>;
  changeUserStatus(props: ChangeUserStatusDTO): Promise<IserviceResponseType>;
  changeAdminStatus(props: ChangeAdminStatusDTO): Promise<IserviceResponseType>;
  insertAdmin(props: InsertAdminDTO): Promise<IserviceResponseType>;
  refreshToken(props: RefreshTokenDTO): Promise<IserviceResponseType>;
}
