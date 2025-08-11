import { FilterQuery, Model } from "mongoose";

import BaseRepository from "./baseRepository";

import IbaseRepository from "../interface/IbaseRepository";
import IcommentModel from "../interface/IcommentModel";

export default class CommentRepository
  extends BaseRepository<IcommentModel>
  implements IbaseRepository<IcommentModel>
{
  constructor(model: Model<IcommentModel>) {
    super(model);
  }

  async insertComment(data: Partial<IcommentModel>): Promise<IcommentModel> {
    return this.insert(data);
  }

  async findMany(
    filter: FilterQuery<IcommentModel>
  ): Promise<IcommentModel[] | []> {
    return this.findAll(filter);
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
