import { Model } from "mongoose";

import BaseRepository from "./baseRepository";
import IbaseRepository from "../interface/IbaseRepository";
import IcommentModel from "../interface/IcommentModel";

export default class commentRepository
  extends BaseRepository<IcommentModel>
  implements IbaseRepository<IcommentModel>
{
  constructor(model: Model<IcommentModel>) {
    super(model);
  }

  async findComments({
    request_id1,
    commentCount,
  }: {
    request_id1: string;
    commentCount: number;
  }): Promise<IcommentModel[] | null> {
    return this.findCommentsLimit({ request_id: request_id1, commentCount });
  }
}
