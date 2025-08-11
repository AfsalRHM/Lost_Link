import { FilterQuery } from "mongoose";

import IreportModel from "./IreportModel";

export interface IreportRepository {
  findReport(filter: FilterQuery<IreportModel>): Promise<IreportModel | null>;
  insertReport(data: Partial<IreportModel>): Promise<IreportModel>;
  findManyReport(filter: FilterQuery<IreportModel>): Promise<IreportModel[] | []>;
  findReports({
    request_id1,
    commentCount,
  }: {
    request_id1: string;
    commentCount: number;
  }): Promise<IreportModel[] | null>;
}
