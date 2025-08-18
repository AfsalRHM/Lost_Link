import IadminModel from "./IadminModel";

export interface IadminRepository {
  findAdmin(adminMail: string): Promise<IadminModel | null>;
  findAllAdmins(): Promise<IadminModel[] | []>;
  changeAdminStatus(adminId: string): Promise<IadminModel | null>;
  insertAdmin(data: Partial<IadminModel>): Promise<IadminModel>;
  findPaginatedAdmins(filter: object, skip: number, limit: number): Promise<any>;
  findSomeAdmins(): Promise<IadminModel[]>;
}
