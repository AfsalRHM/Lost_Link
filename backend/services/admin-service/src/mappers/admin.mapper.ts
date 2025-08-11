import IadminModel from "../interface/IadminModel";
import { adminEntity } from "../entities/admin.entity";
import { GetAllAdminResponseDto } from "../dtos/getAllAdmins.dto";

export class AdminMapper {
  static toEntity(doc: IadminModel): adminEntity {
    return {
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      role: doc.role,
      status: doc.status,
      password: doc.password,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  static toGetAllAdminsDto(entity: adminEntity): GetAllAdminResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      role: entity.role,
      status: entity.status,
      createdAt: entity.createdAt,
    };
  }
}
