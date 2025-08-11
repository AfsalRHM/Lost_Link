import { FilterQuery, Model } from "mongoose";

import BaseRepository from "./baseRepository";

import IbaseRepository from "../interface/IbaseRepository";
import IreportModel from "../interface/IreportModel";

export default class ReportRepository
  extends BaseRepository<IreportModel>
  implements IbaseRepository<IreportModel>
{
  constructor(model: Model<IreportModel>) {
    super(model);
  }

  findReport(filter: FilterQuery<IreportModel>): Promise<IreportModel | null> {
    return this.findOne(filter);
  }

  async insertReport(data: Partial<IreportModel>): Promise<IreportModel> {
    return this.insert(data);
  }

  async findManyReport(
    filter: FilterQuery<IreportModel>
  ): Promise<IreportModel[] | []> {
    return this.findAll(filter);
  }

  async findReports({
    request_id1,
    commentCount,
  }: {
    request_id1: string;
    commentCount: number;
  }): Promise<IreportModel[] | null> {
    return this.findCommentsLimit({ request_id: request_id1, commentCount });
  }
}
