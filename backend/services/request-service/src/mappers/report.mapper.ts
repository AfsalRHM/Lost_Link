import IreportModel from "../interface/IreportModel";
import { reportEntity } from "../entities/report.entity";

import { AdminGetReportSummaryResponseDto } from "../dtos/report/getReportDetails.dto";

export class ReportMapper {
  static toEntity(doc: IreportModel): reportEntity {
    return {
      id: doc._id.toString(),
      userId: doc.user_id.toString(),
      userName: doc.user_name,
      reason: doc.reason,
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  static toGetReportSummaryDto(
    entity: reportEntity
  ): AdminGetReportSummaryResponseDto {
    return {
      id: entity.id,
      userName: entity.userName,
      reason: entity.reason,
      createdAt: entity.createdAt,
    };
  }
}
