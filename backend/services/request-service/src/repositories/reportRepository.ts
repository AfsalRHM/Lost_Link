import { Model } from "mongoose";

import BaseRepository from "./baseRepository";

import IbaseRepository from "../interface/IbaseRepository";
import IreportModel from "../interface/IreportModel";

export default class reportRepository
  extends BaseRepository<IreportModel>
  implements IbaseRepository<IreportModel>
{
  constructor(model: Model<IreportModel>) {
    super(model);
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
