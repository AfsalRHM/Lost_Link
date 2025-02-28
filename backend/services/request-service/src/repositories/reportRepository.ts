import IbaseRepository from "../interface/IbaseRepository";
import BaseRepository from "./baseRepository";
import IreportModel from "../interface/IreportModel";
import reportModel from "../models/reportModel";

export default class reportRepository
  extends BaseRepository<IreportModel>
  implements IbaseRepository<IreportModel>
{
  constructor() {
    super(reportModel);
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
