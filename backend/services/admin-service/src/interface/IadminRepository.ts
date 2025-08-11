import IadminModel from "./IadminModel";

export interface IadminRepository {
  findAdmin(adminMail: string): Promise<IadminModel | null>;
  findAll(): Promise<IadminModel[] | []>;
  changeStatus(adminId: string): Promise<IadminModel | null>;
  insertAdmin(data: Partial<IadminModel>): Promise<IadminModel>;
}
